import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getStory, stories } from "@/data/stories";
import { getProduct } from "@/data/products";
import { getProducer } from "@/data/producers";
import { Photo } from "@/components/editorial/Photo";
import { RichText } from "@/components/editorial/RichText";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { StoryCard } from "@/components/editorial/StoryCard";
import { JsonLd } from "@/components/editorial/JsonLd";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  return {
    title: story.title,
    description: story.excerpt,
    openGraph: { type: "article", title: story.title, description: story.excerpt },
  };
}

export default async function StoryPage({ params }: PageProps<"/[locale]/stories/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const story = getStory(slug);
  if (!story) notFound();
  const t = await getTranslations("stories");
  const featured = story.products.map(getProduct).filter((p) => !!p);
  const producer = story.producer ? getProducer(story.producer) : undefined;
  const more = stories.filter((s) => s.slug !== story.slug).slice(0, 3);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: story.title,
          description: story.excerpt,
          publisher: { "@type": "Organization", name: "Lento" },
        }}
      />
      <header className="mx-auto max-w-3xl px-4 pt-12 text-center sm:px-6 sm:pt-16">
        <nav aria-label="Breadcrumb" className="eyebrow text-muted">
          <Link href="/stories" className="hover:text-wine">
            {t("title")}
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{story.kicker}</span>
        </nav>
        <h1 className="display mt-6 text-5xl sm:text-7xl">{story.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl font-serif text-xl leading-snug sm:text-2xl">{story.excerpt}</p>
        <p className="eyebrow mt-6 text-muted">{t("minutes", { count: story.readingMinutes })}</p>
      </header>

      <div className="mx-auto mt-12 max-w-[1400px] px-4 sm:px-6">
        <Photo folder="stories" slug={story.slug} alt={story.title} aspect="aspect-[4/5] sm:aspect-[21/9]" priority />
      </div>

      <div className="mx-auto mt-14 max-w-2xl px-4 sm:px-6">
        <RichText text={story.body} className="text-[1.125rem] first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.85] first-letter:text-wine" />
        {producer && (
          <p className="mt-12 border-t hairline pt-6">
            <Link href={`/producers/${producer.slug}`} className="eyebrow border-b border-ink pb-1 hover:text-wine">
              {t("producer", { name: producer.name })} →
            </Link>
          </p>
        )}
      </div>

      {featured.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6" aria-labelledby="in-story">
          <SectionHeading id="in-story" title={t("inStory")} />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 pt-10 sm:gap-x-8 lg:grid-cols-4">
            {featured.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6" aria-labelledby="more">
        <SectionHeading id="more" title={t("more")} href="/stories" linkLabel={t("all")} />
        <ul className="grid gap-x-8 gap-y-14 pt-10 md:grid-cols-3">
          {more.map((s) => (
            <li key={s.slug}>
              <StoryCard story={s} minutesLabel={t("minutes", { count: s.readingMinutes })} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
