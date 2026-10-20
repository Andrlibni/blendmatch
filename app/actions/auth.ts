"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError, CredentialsSignin } from "next-auth";
import { getLocale } from "next-intl/server";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { businessTypes, countries, type CountryCode } from "@/lib/config";
import { validateVat } from "@/lib/vat";

export type LoginState = { error?: "invalid" | "pending" };

function safeCallback(raw: FormDataEntryValue | null, locale: string) {
  const value = typeof raw === "string" ? raw : "";
  // Only allow local paths to avoid open redirects.
  return value.startsWith("/") && !value.startsWith("//") ? value : `/${locale}/shop`;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const locale = await getLocale();
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: safeCallback(formData.get("callbackUrl"), locale),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error instanceof CredentialsSignin && error.code === "pending" ? "pending" : "invalid" };
    }
    throw error; // NEXT_REDIRECT on success
  }
  return {};
}

export async function signOutAction() {
  const locale = await getLocale();
  await signOut({ redirectTo: `/${locale}` });
}

// ——— Trade account application ———

export type ApplyState = {
  ok?: boolean;
  method?: string;
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
};

const countryCodes = countries.map((c) => c.code) as [CountryCode, ...CountryCode[]];

const applySchema = z
  .object({
    company: z.string().trim().min(2, "required").max(160),
    contactName: z.string().trim().min(2, "required").max(120),
    email: z.email("email").max(200).transform((e) => e.toLowerCase()),
    phone: z.string().trim().max(40).optional(),
    businessType: z.enum(businessTypes, "required"),
    country: z.enum(countryCodes, "required"),
    vatNumber: z.string().trim().min(4, "required").max(30),
    password: z.string().min(8, "password").max(200),
    passwordConfirm: z.string(),
    terms: z.literal("on", "required"),
  })
  .refine((v) => v.password === v.passwordConfirm, { path: ["passwordConfirm"], message: "mismatch" });

export async function applyAction(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const { password: _p, passwordConfirm: _c, ...values } = raw;
  void _p;
  void _c;

  const parsed = applySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] ??= issue.message;
    }
    return { fieldErrors, values };
  }
  const data = parsed.data;

  const vat = await validateVat(data.country, data.vatNumber);
  if (!vat.ok) return { fieldErrors: { vatNumber: `vat_${vat.error}` }, values };

  const existing = await db.tradeAccount.findUnique({ where: { email: data.email } });
  if (existing) return { fieldErrors: { email: "taken" }, values };

  await db.tradeAccount.create({
    data: {
      email: data.email,
      passwordHash: await bcrypt.hash(data.password, 12),
      company: data.company,
      contactName: data.contactName,
      phone: data.phone || null,
      businessType: data.businessType,
      country: data.country,
      vatNumber: vat.vatNumber,
      vatCheck: vat.method,
      vatCheckName: vat.name ?? null,
      vatCheckNote: vat.note ?? null,
      vatCheckedAt: new Date(),
    },
  });

  return { ok: true, method: vat.method };
}
