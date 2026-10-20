"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const COOKIE = "lento_age";

export function AgeGate() {
  const t = useTranslations("age");
  const [visible, setVisible] = useState(true);
  const [refused, setRefused] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const site = document.getElementById("site");
    if (visible) {
      site?.setAttribute("inert", "");
      document.body.style.overflow = "hidden";
      confirmRef.current?.focus();
    }
    return () => {
      site?.removeAttribute("inert");
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  function confirm() {
    document.cookie = `${COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
      aria-describedby="age-desc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ivory px-6"
    >
      <div className="w-full max-w-md text-center">
        <p className="font-serif text-4xl tracking-[0.32em] text-wine">
          <span className="pl-[0.32em]">LENTO</span>
        </p>
        <div className="mx-auto my-10 h-px w-16 bg-line" />
        <h2 id="age-title" className="display text-3xl sm:text-4xl">
          {t("title")}
        </h2>
        <p id="age-desc" className="mt-4 text-sm leading-relaxed text-muted">
          {t("body")}
        </p>
        {refused ? (
          <p role="alert" className="mt-10 text-sm">
            {t("refused")}
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3">
            <button
              ref={confirmRef}
              type="button"
              onClick={confirm}
              className="eyebrow bg-ink py-4 text-ivory transition-colors duration-300 hover:bg-wine"
            >
              {t("yes")}
            </button>
            <button
              type="button"
              onClick={() => setRefused(true)}
              className="eyebrow border border-ink py-4 transition-colors duration-300 hover:bg-ivory-deep"
            >
              {t("no")}
            </button>
          </div>
        )}
        <p className="mt-10 text-xs text-muted">{t("legal")}</p>
      </div>
    </div>
  );
}
