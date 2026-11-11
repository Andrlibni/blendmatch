import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProduct, products } from "@/data/products";
import { getProducer } from "@/data/producers";
import { stories } from "@/data/stories";
import { formatLabel, relatedProducts } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { imageFor } from "@/lib/images";
import { photoCredits } from "@/data/photo-credits";
import { SITE_URL, TRADE_RULES } from "@/lib/config";
import { getTradeInfo } from "@/lib/shop-context";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductCard } from "@/components/product/ProductCard";
import { Price } from "@/components/product/Price";
import { AddToCart } from "@/components/product/AddToCart";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { JsonLd } from "@/components/editorial/JsonLd";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/shop/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const producer = getProducer(product.producer);
  const title = `${product.name} — ${producer?.name}`;
  const image = imageFor("products", product.slug);
  return {
    title,
    description: product.short,
    alternates: { canonical: `/${locale}/shop/${slug}` },
    openGraph: {
      type: "website",
      title,
      description: product.short,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/[locale]/shop/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProduct(slug);
  if (!product) notFound();

  const [t, ts, trade] = await Promise.all([
    getTranslations("product"),
    getTranslations("shop"),
    getTradeInfo(),
  ]);
  const producer = getProducer(product.producer)!;
  const related = relatedProducts(product);
  const story = stories.find((s) => s.products.includes(product.slug));
  const region = ts.has(`regions.${product.region}`)
    ? ts(`regions.${product.region}`)
    : product.region;

  const specs: { label: string; value: string }[] =
    product.kind === "wine"
      ? [
          { label: t("specs.appellation"), value: product.appellation },
          { label: t("specs.grapes"), value: product.grapes.join(", ") },
          { label: t("specs.region"), value: `${region} · ${product.area}` },
          { label: t("specs.vintage"), value: product.vintage ? String(product.vintage) : t("specs.currentVintage") },
          ...(product.soil ? [{ label: t("specs.soil"), value: product.soil }] : []),
          { label: t("specs.vinification"), value: product.vinification },
          {
            label: t("specs.so2"),
            value: product.so2Total ? `${product.so2Total} mg/l` : t("specs.onRequest"),
          },
          {
            label: t("specs.abv"),
            value: product.abv ? `${formatNumber(product.abv, locale)}% vol` : t("specs.onRequest"),
          },
          { label: t("specs.format"), value: formatLabel(product) },
        ]
      : [
          ...(product.presidio
            ? [{ label: t("specs.presidio"), value: product.presidio }]
            : []),
          { label: t("specs.region"), value: `${region} · ${product.area}` },
          { label: t("specs.ingredients"), value: product.ingredients },
          { label: t("specs.shelfLife"), value: product.shelfLife },
          { label: t("specs.format"), value: formatLabel(product) },
        ];

  const image = imageFor("products", product.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short,
    sku: product.slug,
    brand: { "@type": "Brand", name: producer.name },
    category: product.kind === "wine" ? "Wine" : "Food",
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
    ...(product.kind === "wine"
      ? {
          additionalProperty: [
            ...(product.abv
              ? [{ "@type": "PropertyValue", name: "Alcohol", value: `${product.abv}%` }]
              : []),
            { "@type": "PropertyValue", name: "Grapes", value: product.grapes.join(", ") },
            { "@type": "PropertyValue", name: "Appellation", value: product.appellation },
            ...(product.vintage
              ? [{ "@type": "PropertyValue", name: "Vintage", value: product.vintage }]
              : []),
          ],
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/${locale}/shop/${product.slug}`,
      priceCurrency: "EUR",
      price: product.retailPrice.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <JsonLd data={jsonLd} />
      <nav aria-label={ts("breadcrumb")} className="eyebrow py-6 text-muted">
        <Link href="/shop" className="hover:text-wine">
          {ts("title")}
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href={`/shop?type=${product.category}`} className="hover:text-wine">
          {ts(`types.${product.category}`)}
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <ProductImage product={product} priority sizes="(min-width: 1024px) 55vw, 100vw" />
          {photoCredits[product.slug]?.kind === "licensed" && (
            <p className="mt-3 text-xs text-muted">
              {t("photoIllustrative")}{" "}
              <Link href="/credits" className="underline underline-offset-4 hover:text-wine">
                {t("photoCredits")}
              </Link>
            </p>
          )}
        </div>

        <div className="pb-8">
          <Link href={`/producers/${producer.slug}`} className="eyebrow text-muted hover:text-wine">
            {producer.name}
          </Link>
          <h1 className="display mt-3 text-5xl sm:text-6xl">{product.name}</h1>
          <p className="mt-5 text-lg leading-relaxed">{product.short}</p>

          <div className="mt-8 border-t hairline pt-6">
            <Price product={product} size="lg" />
            {trade ? (
              <p className="eyebrow mt-2 text-muted">
                {product.kind === "wine"
                  ? t("tradeCase", { size: TRADE_RULES.wineCaseSize })
                  : t("tradeCasePantry", { size: product.caseSize })}
              </p>
            ) : (
              <p className="eyebrow mt-2 text-muted">{t("retailIncl")}</p>
            )}
            <div className="mt-6">
              <AddToCart slug={product.slug} />
            </div>
          </div>

          <section className="mt-10" aria-labelledby="tasting">
            <h2 id="tasting" className="eyebrow border-b hairline pb-3">
              {product.kind === "wine" ? t("tastingNote") : t("description")}
            </h2>
            <p className="mt-4 font-serif text-[1.35rem] leading-snug">{product.tastingNote}</p>
            {product.pairing && (
              <p className="mt-4 text-sm text-muted">
                <span className="eyebrow mr-2 text-ink">{t("pairing")}</span>
                {product.pairing}
              </p>
            )}
          </section>

          <section className="mt-10" aria-labelledby="specs">
            <h2 id="specs" className="eyebrow border-b hairline pb-3">
              {t("specsTitle")}
            </h2>
            <dl>
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="grid grid-cols-[minmax(7rem,35%)_1fr] gap-4 border-b hairline py-3.5 text-sm"
                >
                  <dt className="eyebrow pt-0.5 text-muted">{s.label}</dt>
                  <dd className="leading-relaxed">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      {/* The story */}
      <section className="mt-20 border-t hairline pt-16" aria-labelledby="story">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="eyebrow text-muted">{t("storyKicker")}</p>
            <h2 id="story" className="display mt-3 text-4xl">
              {t("storyTitle", { producer: producer.name })}
            </h2>
          </div>
          <div>
            <p className="font-serif text-2xl leading-snug">{product.story}</p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Link
                href={`/producers/${producer.slug}`}
                className="eyebrow underline underline-offset-4 hover:text-wine"
              >
                {t("meetProducer")}
              </Link>
              {story && (
                <Link
                  href={`/stories/${story.slug}`}
                  className="eyebrow underline underline-offset-4 hover:text-wine"
                >
                  {t("readStory", { title: story.title })}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24" aria-labelledby="related">
        <SectionHeading id="related" title={t("related")} href="/shop" linkLabel={ts("quick.all")} />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 pt-10 sm:gap-x-8 lg:grid-cols-4">
          {related.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
