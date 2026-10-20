"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { usePricingMode, useShop } from "@/components/providers/ShopProvider";
import { computeCart } from "@/lib/pricing";
import { countries } from "@/lib/config";
import type { CheckoutState } from "@/app/actions/orders";
import { TextAreaField, TextField, SelectField, SubmitButton } from "@/components/ui/Field";
import { OrderSummary } from "./OrderSummary";
import { CartIssues } from "./CartIssues";

type Defaults = Partial<Record<"name" | "email" | "company" | "country", string>>;

export function CheckoutForm({
  action,
  defaults = {},
}: {
  action: (prev: CheckoutState, formData: FormData) => Promise<CheckoutState>;
  defaults?: Defaults;
}) {
  const t = useTranslations("checkout");
  const tc = useTranslations("cart");
  const { cart, cartReady, money, trade } = useShop();
  const mode = usePricingMode();
  const summary = computeCart(cart, mode);
  const [state, formAction, pending] = useActionState(action, {});
  const fe = (key: string) => {
    const code = state.fieldErrors?.[key];
    return code ? t(`errors.${code}`) : undefined;
  };

  if (!cartReady) return <p className="py-24 text-center text-sm text-muted">{tc("loading")}</p>;
  if (summary.lines.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-3xl text-wine">{tc("empty")}</p>
        <Link href="/shop" className="eyebrow mt-8 inline-block bg-ink px-6 py-4 text-ivory hover:bg-wine">
          {tc("continue")}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16" noValidate>
      <input type="hidden" name="cart" value={JSON.stringify(cart)} />
      <div className="space-y-12">
        {state.error && (
          <p role="alert" className="border-l-2 border-alert pl-4 text-sm text-alert">
            {t(`errors.${state.error}`)}
          </p>
        )}
        <fieldset>
          <legend className="eyebrow w-full border-b hairline pb-3">{trade ? t("deliveryTrade") : t("contact")}</legend>
          <div className="grid gap-6 pt-6 sm:grid-cols-2">
            <TextField name="name" label={t("name")} autoComplete="name" required defaultValue={defaults.name} error={fe("name")} />
            <TextField name="email" type="email" label={t("email")} autoComplete="email" required defaultValue={defaults.email} error={fe("email")} />
            <TextField name="phone" type="tel" label={t("phone")} autoComplete="tel" error={fe("phone")} />
          </div>
        </fieldset>
        <fieldset>
          <legend className="eyebrow w-full border-b hairline pb-3">{t("address")}</legend>
          <div className="grid gap-6 pt-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextField name="address" label={t("street")} autoComplete="street-address" required error={fe("address")} />
            </div>
            <TextField name="city" label={t("city")} autoComplete="address-level2" required error={fe("city")} />
            <TextField name="postcode" label={t("postcode")} autoComplete="postal-code" required error={fe("postcode")} />
            {trade ? (
              <div>
                <p className="eyebrow text-muted">{t("country")}</p>
                <p className="mt-2 border-b border-ink/30 py-2.5 text-[0.95rem]">
                  {countries.find((c) => c.code === trade.country)?.name}
                </p>
                <input type="hidden" name="country" value={trade.country} />
              </div>
            ) : (
              <SelectField name="country" label={t("country")} autoComplete="country" required defaultValue={defaults.country ?? "GB"} error={fe("country")}>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </SelectField>
            )}
          </div>
        </fieldset>
        <fieldset>
          <legend className="eyebrow w-full border-b hairline pb-3">{t("notesTitle")}</legend>
          <div className="pt-6">
            <TextAreaField name="notes" label={trade ? t("notesTrade") : t("notes")} error={fe("notes")} />
          </div>
        </fieldset>
        {!trade && (
          <div>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" name="age" required className="mt-1 size-4 accent-ink" aria-invalid={fe("age") ? true : undefined} />
              <span>{t("ageConfirm")}</span>
            </label>
            {fe("age") && <p className="mt-1.5 text-xs text-alert">{fe("age")}</p>}
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="border border-ink p-6">
          <h2 className="eyebrow border-b hairline pb-4">{trade ? tc("tradeSummary") : tc("summaryTitle")}</h2>
          <ul className="divide-y divide-line border-b hairline">
            {summary.lines.map((l) => (
              <li key={l.product.slug} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  <span className="tabular-nums">{l.qty} ×</span> {l.product.name}
                </span>
                <span className="tabular-nums">{money(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="pt-3">
            <OrderSummary summary={summary} />
          </div>
          <CartIssues issues={summary.issues} />
          <div className="mt-6">
            <SubmitButton pending={pending}>
              {pending ? t("sending") : trade ? t("submitTrade") : t("submit", { total: money(summary.total) })}
            </SubmitButton>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">{trade ? t("tradeNote") : t("mockNote")}</p>
        </div>
      </aside>
    </form>
  );
}
