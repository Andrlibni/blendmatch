import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProducer, producers } from "@/data/producers";
import { productsByProducer } from "@/data/products";
import { stories } from "@/data/stories";
import { Photo } from "@/components/editorial/Photo";
import { RichText } from "@/components/editorial/RichText";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";

export function generateStaticParams() {
  return producers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/producers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const producer = getProducer(slug);
  if (!producer) return {};
  return { title: producer.name, description: producer.tagline };
}

export default async function ProducerPage({ params }: PageProps<"/[locale]/producers/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const producer = getProducer(slug);
  if (!producer) notFound();
  const t = await getTranslations("producers");
  const range = productsByProducer(producer.slug);
  const story = stories.find((s) => s.producer === producer.slug);

  return (
    <article>
      <header className="mx-auto max-w-[1400px] px-4 pt-12 text-center sm:px-6 sm:pt-16">
        <nav aria-label="Breadcrumb" className="eyebrow text-muted">
          <Link href="/producers" className="hover:text-wine">
            {t("title")}
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{producer.name}</span>
        </nav>
        <h1 className="display mt-6 text-5xl sm:text-7xl">{producer.name}</h1>
        <p className="mx-auto mt-5 max-w-2xl font-serif text-xl leading-snug sm:text-2xl">{producer.tagline}</p>
      </header>

      {producer.featured && (
        <div className="mx-auto mt-12 max-w-[1400px] px-4 sm:px-6">
          <Photo folder="producers" slug={producer.slug} alt={producer.name} aspect="aspect-[4/5] sm:aspect-[21/9]" priority />
        </div>
      )}

      <div className="mx-auto mt-14 grid max-w-[1400px] gap-12 px-4 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-24">
        <aside>
          <dl className="border-t hairline">
            {[
              [t("region"), `${producer.region} · ${producer.area}`],
              ...(producer.founded ? [[t("founded"), String(producer.founded)]] : []),
              ...(producer.hectares ? [[t("hectares"), `${producer.hectares} ha`]] : []),
              [t("farming"), producer.farming],
            ].map(([label, value]) => (
              <div key={label} className="border-b hairline py-4">
                <dt className="eyebrow text-muted">{label}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="max-w-2xl">
          <RichText text={producer.story} className="first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.9] first-letter:text-wine" />
          {story && (
            <Link
              href={`/stories/${story.slug}`}
              className="eyebrow mt-10 inline-block border-b border-ink pb-1 hover:text-wine"
            >
              {t("readStory", { title: story.title })} →
            </Link>
          )}
        </div>
      </div>

      {range.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6" aria-labelledby="range">
          <SectionHeading id="range" title={t("range")} />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 pt-10 sm:gap-x-8 lg:grid-cols-4">
            {range.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
