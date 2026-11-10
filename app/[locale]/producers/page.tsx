import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { producers } from "@/data/producers";
import { productsByProducer } from "@/data/products";
import { Photo } from "@/components/editorial/Photo";

export async function generateMetadata({ params }: PageProps<"/[locale]/producers">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "producers" });
  return { title: t("title"), description: t("description") };
}

export default async function ProducersPage({ params }: PageProps<"/[locale]/producers">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("producers");
  const featured = producers.filter((p) => p.featured);
  const partners = producers.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <header className="border-b hairline pb-12 pt-12 text-center sm:pt-16">
        <p className="eyebrow text-muted">{t("kicker")}</p>
        <h1 className="display mt-5 text-5xl sm:text-6xl">{t("title")}</h1>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">{t("description")}</p>
      </header>

      <ul className="divide-y divide-line">
        {featured.map((p, i) => (
          <li key={p.slug} className="py-14 sm:py-20">
            <article className="group grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <Link href={`/producers/${p.slug}`} className={i % 2 ? "md:order-2" : ""} tabIndex={-1} aria-hidden="true">
                <Photo folder="producers" slug={p.slug} alt={p.name} aspect="aspect-[5/4]" sizes="(min-width: 768px) 50vw, 100vw" />
              </Link>
              <div>
                <p className="eyebrow text-muted">
                  {p.region} · {p.area}
                </p>
                <h2 className="display mt-3 text-4xl sm:text-5xl">
                  <Link href={`/producers/${p.slug}`}>{p.name}</Link>
                </h2>
                <p className="mt-5 font-serif text-xl leading-snug">{p.tagline}</p>
                <dl className="eyebrow mt-8 grid grid-cols-3 gap-4 border-t hairline pt-5 text-muted">
                  <div>
                    <dt>{t("founded")}</dt>
                    <dd className="mt-1 text-ink">{p.founded ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>{t("hectares")}</dt>
                    <dd className="mt-1 text-ink">{p.hectares ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>{t("products")}</dt>
                    <dd className="mt-1 text-ink">{productsByProducer(p.slug).length}</dd>
                  </div>
                </dl>
                <Link
                  href={`/producers/${p.slug}`}
                  className="eyebrow mt-8 inline-block border-b border-ink pb-1 hover:text-wine"
                >
                  {t("discover")} →
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <section className="border-t hairline pt-16" aria-labelledby="partners">
        <div className="max-w-2xl">
          <h2 id="partners" className="display text-4xl">
            {t("partnersTitle")}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">{t("partnersBody")}</p>
        </div>
        <ul className="mt-10 grid gap-x-10 border-t hairline sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <li key={p.slug} className="border-b hairline py-6">
              <p className="eyebrow text-muted">{p.region} · {p.area}</p>
              <h3 className="mt-2 font-serif text-2xl text-wine">
                <Link href={`/producers/${p.slug}`} className="hover:underline underline-offset-4">
                  {p.name}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed">{p.tagline}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
