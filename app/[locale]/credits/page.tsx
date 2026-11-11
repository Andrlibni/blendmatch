import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { photoCredits } from "@/data/photo-credits";
import { getProduct } from "@/data/products";

export async function generateMetadata({ params }: PageProps<"/[locale]/credits">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "credits" });
  return { title: t("title") };
}

export default async function CreditsPage({ params }: PageProps<"/[locale]/credits">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("credits");
  const entries = Object.entries(photoCredits)
    .map(([slug, c]) => ({ slug, c, product: getProduct(slug) }))
    .filter((e) => e.product);
  const licensed = entries.filter((e) => e.c.kind === "licensed");
  const retailer = entries.filter((e) => e.c.kind === "retailer");

  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="display text-5xl">{t("title")}</h1>
      <p className="mt-6 leading-relaxed text-muted">{t("intro")}</p>

      {licensed.length > 0 && (
        <section className="mt-12" aria-labelledby="licensed">
          <h2 id="licensed" className="eyebrow border-b hairline pb-3">{t("licensed")}</h2>
          <ul>
            {licensed.map(({ slug, c, product }) =>
              c.kind === "licensed" ? (
                <li key={slug} className="border-b hairline py-4 text-sm leading-relaxed">
                  <Link href={`/shop/${slug}`} className="font-serif text-lg text-wine hover:underline underline-offset-4">
                    {product!.name}
                  </Link>
                  <p className="mt-1">
                    “{c.title}” — {c.author} · {c.license} ·{" "}
                    <a href={c.url} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                      {c.source}
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-muted">{t("illustrative")}</p>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      )}

      {retailer.length > 0 && (
        <section className="mt-12" aria-labelledby="retailer">
          <h2 id="retailer" className="eyebrow border-b hairline pb-3">{t("retailer")}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">{t("retailerNote")}</p>
          <ul className="mt-2">
            {retailer.map(({ slug, c, product }) => (
              <li key={slug} className="flex justify-between gap-4 border-b hairline py-3 text-sm">
                <Link href={`/shop/${slug}`} className="hover:text-wine">{product!.name}</Link>
                <span className="text-muted">{c.source}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
