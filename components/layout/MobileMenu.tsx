"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { mainNav } from "./nav";

export function MobileMenu() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Close the menu after navigating.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="eyebrow -ml-2 p-2 lg:hidden"
        aria-haspopup="dialog"
      >
        {t("menu")}
      </button>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label={t("menu")}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-ivory p-0 text-ink backdrop:bg-ink/30"
      >
        <div className="flex items-center justify-between border-b hairline px-4 py-4">
          <span className="font-serif text-2xl tracking-[0.32em] text-wine">LENTO</span>
          <button type="button" onClick={() => setOpen(false)} className="eyebrow p-2">
            {t("close")}
          </button>
        </div>
        <nav aria-label={t("main")}>
          <ul>
            {mainNav.map((item) => (
              <li key={item.key} className="border-b hairline">
                <Link href={item.href} className="block px-4 py-5 font-serif text-3xl text-wine">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  );
}
