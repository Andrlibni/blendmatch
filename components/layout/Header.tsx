import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { CartLink } from "./CartLink";
import { MobileMenu } from "./MobileMenu";
import { mainNav } from "./nav";

export async function Header() {
  const t = await getTranslations("nav");
  return (
    <header className="no-print border-b hairline bg-ivory">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center py-5 lg:py-8">
          <div className="justify-self-start">
            <MobileMenu />
            <p className="eyebrow hidden text-muted lg:block">{t("tagline")}</p>
          </div>
          <Logo />
          <div className="justify-self-end">
            <CartLink />
          </div>
        </div>
        <nav aria-label={t("main")} className="hidden border-t hairline lg:block">
          <ul className="flex items-center justify-center gap-10 py-4">
            {mainNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="eyebrow text-[0.75rem] transition-colors duration-300 hover:text-wine"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
