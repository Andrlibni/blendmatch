import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");
  const year = 2026;

  const columns = [
    {
      title: t("shop"),
      links: [
        { href: "/shop", label: n("shop") },
        { href: "/shop?category=wine", label: n("wine") },
        { href: "/shop?category=pantry", label: n("pantry") },
        { href: "/shop?category=treasures", label: t("treasures") },
      ],
    },
    {
      title: t("about"),
      links: [
        { href: "/producers", label: n("producers") },
        { href: "/stories", label: n("stories") },
        { href: "/trade", label: n("trade") },
      ],
    },
    {
      title: t("help"),
      links: [
        { href: "/legal/shipping", label: t("shipping") },
        { href: "/legal/terms", label: t("terms") },
        { href: "/legal/privacy", label: t("privacy") },
        { href: "/legal/cookies", label: t("cookies") },
        { href: "/credits", label: t("credits") },
      ],
    },
  ];

  return (
    <footer className="no-print mt-24 border-t hairline bg-ivory-deep">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 max-w-sm md:col-span-1">
          <p className="font-serif text-3xl tracking-[0.32em] text-wine">LENTO</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{t("blurb")}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="eyebrow text-muted">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-wine">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="overflow-hidden px-4 sm:px-6">
        <p className="footer-wordmark mx-auto max-w-[1400px] select-none text-center font-serif leading-[0.8] tracking-[0.12em] text-transparent">
          LENTO
        </p>
      </div>
      <div className="border-t hairline">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>© {year} Lento. {t("rights")}</p>
          <p>{t("responsible")}</p>
        </div>
      </div>
    </footer>
  );
}
