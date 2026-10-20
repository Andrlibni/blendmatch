"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { applyAction, type ApplyState } from "@/app/actions/auth";
import { businessTypes, countries, type CountryCode } from "@/lib/config";
import { vatExamples } from "@/lib/vat/formats";
import { SelectField, SubmitButton, TextField } from "@/components/ui/Field";

type LiveCheck =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "done"; ok: boolean; message: string };

export function ApplyForm() {
  const t = useTranslations("trade.apply");
  const [state, action, pending] = useActionState<ApplyState, FormData>(applyAction, {});
  const v = state.values ?? {};
  const [country, setCountry] = useState<CountryCode>((v.country as CountryCode) ?? "GB");
  const [live, setLive] = useState<LiveCheck>({ state: "idle" });

  const fe = (key: string) => {
    const code = state.fieldErrors?.[key];
    return code ? t(`errors.${code}`) : undefined;
  };

  async function checkVat(value: string) {
    if (value.trim().length < 4) return setLive({ state: "idle" });
    setLive({ state: "checking" });
    try {
      const res = await fetch("/api/vat/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, vat: value }),
      });
      const data = await res.json();
      if (!data.ok) return setLive({ state: "done", ok: false, message: t(`errors.vat_${data.error}`) });
      setLive({
        state: "done",
        ok: true,
        message: t(`vatResult.${data.method}`, { name: data.name ?? "" }),
      });
    } catch {
      setLive({ state: "idle" });
    }
  }

  if (state.ok) {
    return (
      <div role="status" className="border border-ink p-8 sm:p-10">
        <p className="eyebrow text-muted">{t("successKicker")}</p>
        <h3 className="display mt-3 text-4xl">{t("successTitle")}</h3>
        <p className="mt-4 leading-relaxed">{t("successBody")}</p>
        {state.method === "unverified" && <p className="mt-3 text-sm text-muted">{t("successUnverified")}</p>}
        <Link href="/shop" className="eyebrow mt-8 inline-block border-b border-ink pb-1 hover:text-wine">
          {t("browse")} →
        </Link>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-10">
      {state.error && (
        <p role="alert" className="border-l-2 border-alert pl-4 text-sm text-alert">
          {t(`errors.${state.error}`)}
        </p>
      )}
      <fieldset>
        <legend className="eyebrow w-full border-b hairline pb-3">{t("business")}</legend>
        <div className="grid gap-6 pt-6 sm:grid-cols-2">
          <TextField name="company" label={t("company")} autoComplete="organization" required defaultValue={v.company} error={fe("company")} />
          <SelectField name="businessType" label={t("businessType")} required defaultValue={v.businessType ?? ""} error={fe("businessType")}>
            <option value="" disabled>
              {t("choose")}
            </option>
            {businessTypes.map((b) => (
              <option key={b} value={b}>
                {t(`types.${b}`)}
              </option>
            ))}
          </SelectField>
          <SelectField
            name="country"
            label={t("country")}
            required
            value={country}
            onChange={(e) => {
              setCountry(e.target.value as CountryCode);
              setLive({ state: "idle" });
            }}
            error={fe("country")}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </SelectField>
          <div>
            <TextField
              name="vatNumber"
              label={t("vatNumber")}
              required
              defaultValue={v.vatNumber}
              placeholder={vatExamples[country]}
              autoCapitalize="characters"
              spellCheck={false}
              onBlur={(e) => checkVat(e.target.value)}
              error={fe("vatNumber")}
              hint={t("vatHint")}
            />
            <p aria-live="polite" className="mt-1.5 min-h-4 text-xs">
              {live.state === "checking" && <span className="text-muted">{t("checking")}</span>}
              {live.state === "done" && (
                <span className={live.ok ? "text-ok" : "text-alert"}>
                  {live.ok ? "✓ " : ""}
                  {live.message}
                </span>
              )}
            </p>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow w-full border-b hairline pb-3">{t("contact")}</legend>
        <div className="grid gap-6 pt-6 sm:grid-cols-2">
          <TextField name="contactName" label={t("contactName")} autoComplete="name" required defaultValue={v.contactName} error={fe("contactName")} />
          <TextField name="email" type="email" label={t("email")} autoComplete="email" required defaultValue={v.email} error={fe("email")} hint={t("emailHint")} />
          <TextField name="phone" type="tel" label={t("phone")} autoComplete="tel" defaultValue={v.phone} error={fe("phone")} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow w-full border-b hairline pb-3">{t("access")}</legend>
        <div className="grid gap-6 pt-6 sm:grid-cols-2">
          <TextField name="password" type="password" label={t("password")} autoComplete="new-password" required minLength={8} error={fe("password")} hint={t("passwordHint")} />
          <TextField name="passwordConfirm" type="password" label={t("passwordConfirm")} autoComplete="new-password" required error={fe("passwordConfirm")} />
        </div>
      </fieldset>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="terms" className="mt-1 size-4 accent-ink" aria-invalid={fe("terms") ? true : undefined} />
          <span>
            {t.rich("terms", {
              link: (chunks) => (
                <Link href="/legal/terms" className="underline underline-offset-4">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {fe("terms") && <p className="mt-1.5 text-xs text-alert">{fe("terms")}</p>}
      </div>

      <div className="max-w-sm">
        <SubmitButton pending={pending}>{pending ? t("sending") : t("submit")}</SubmitButton>
      </div>
    </form>
  );
}
