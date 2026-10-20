import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="eyebrow text-muted">404</p>
      <h1 className="display mt-4 text-5xl">{t("title")}</h1>
      <p className="mt-4 text-muted">{t("body")}</p>
      <Link href="/shop" className="eyebrow mt-10 inline-block bg-ink px-6 py-4 text-ivory hover:bg-wine">
        {t("cta")}
      </Link>
    </section>
  );
}
