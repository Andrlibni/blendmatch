"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { SubmitButton, TextField } from "@/components/ui/Field";

export function LoginForm({ callbackUrl, demo }: { callbackUrl?: string; demo?: boolean }) {
  const t = useTranslations("trade.login");
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-6">
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      {state.error && (
        <p role="alert" className="border-l-2 border-alert pl-4 text-sm text-alert">
          {t(`errors.${state.error}`)}
        </p>
      )}
      <TextField name="email" type="email" label={t("email")} autoComplete="username" required defaultValue={demo ? "trade@demo.lento" : undefined} />
      <TextField name="password" type="password" label={t("password")} autoComplete="current-password" required defaultValue={demo ? "demo-trade" : undefined} />
      <SubmitButton pending={pending}>{pending ? t("signingIn") : t("submit")}</SubmitButton>
    </form>
  );
}
