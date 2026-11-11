import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { products, getProduct } from "@/data/products";
import { producers } from "@/data/producers";
import { stories } from "@/data/stories";
import { TRADE_RULES } from "@/lib/config";
import { Photo } from "@/components/editorial/Photo";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/editorial/JsonLd";
import { SITE_URL } from "@/lib/config";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tm = await getTranslations("stories");

  const wines = products.filter((p) => p.kind === "wine");
  const selection = [...wines.filter((p) => p.featured), ...wines.filter((p) => !p.featured && p.isNew)].slice(0, 4);
  const pantry = products.filter((p) => p.treasure).slice(0, 3);
  const producerStories = stories.filter((s) => s.producer);
  const treasuresStory = stories.find((s) => !s.producer);
  const featuredProducers = producers.filter((p) => p.featured);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Lento",
          url: SITE_URL,
          description: t("hero.lead"),
        }}
      />

      {/* Hero: one strong image and a title */}
      <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6">
        <div className="relative">
          <Photo
            folder="home"
            slug="hero"
            alt={t("hero.alt")}
            aspect="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
            tone="dark"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/45 via-black/10 to-transparent p-6 text-ivory sm:p-12 lg:p-16">
            <p className="eyebrow text-[0.75rem]">{t("hero.kicker")} {"//"}</p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-medium leading-[1.02] sm:text-7xl lg:text-8xl">
              {t("hero.title")}
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/stories"
                className="eyebrow bg-ivory px-6 py-3.5 text-ink transition-colors duration-300 hover:bg-ivory-deep"
              >
                {t("hero.ctaStories")}
              </Link>
              <Link
                href="/shop"
                className="eyebrow border border-ivory px-6 py-3.5 transition-colors duration-300 hover:bg-ivory hover:text-ink"
              >
                {t("hero.ctaShop")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 sm:py-32">
        <p className="eyebrow text-center text-muted">{t("manifesto.kicker")}</p>
        <p className="mx-auto mt-8 max-w-4xl text-center font-serif text-3xl leading-[1.25] text-wine sm:text-[2.6rem]">
          {t("hero.lead")}
        </p>
        {/* Three principles: light washes of the accent colours, content aligned from the top */}
        <ul className="mx-auto mt-20 grid max-w-6xl gap-4 sm:mt-24 md:grid-cols-3 md:gap-5">
          {(
            [
              { key: "growers", bg: "bg-wine-wash", accent: "text-wine", rule: "bg-wine/40" },
              { key: "cellar", bg: "bg-terracotta-wash", accent: "text-terracotta", rule: "bg-terracotta/40" },
              { key: "treasures", bg: "bg-olive-wash", accent: "text-olive", rule: "bg-olive/40" },
            ] as const
          ).map(({ key, bg, accent, rule }, i) => (
            <li key={key} className={`${bg} relative overflow-hidden px-8 pb-10 pt-9 sm:px-10 sm:pb-12`}>
              <p className={`eyebrow relative ${accent} opacity-70`}>0{i + 1}</p>
              <h2 className={`relative mt-8 font-serif text-[1.9rem] font-medium leading-tight ${accent}`}>
                {t(`manifesto.${key}.title`)}
              </h2>
              <span aria-hidden="true" className={`relative mt-5 block h-px w-10 ${rule}`} />
              <p className="relative mt-5 max-w-xs text-[0.95rem] leading-relaxed text-ink/80">
                {t(`manifesto.${key}.body`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Stories: the products and where they come from */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6" aria-labelledby="stories-heading">
        <SectionHeading
          id="stories-heading"
          kicker={t("stories.kicker")}
          title={t("stories.title")}
          href="/stories"
          linkLabel={t("stories.all")}
        />
        <ul className="divide-y divide-line">
          {producerStories.map((story, i) => {
            const items = story.products.map(getProduct).filter((p) => !!p).slice(0, 3);
            return (
              <li key={story.slug} className="py-14 sm:py-20">
                <article className="group relative grid items-center gap-8 md:grid-cols-2 md:gap-16">
                  <div className={i % 2 ? "md:order-2" : ""}>
                    <Photo
                      folder="stories"
                      slug={story.slug}
                      alt={story.title}
                      aspect="aspect-[4/5] md:aspect-[5/6]"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="md:px-6">
                    <p className="eyebrow text-muted">
                      {story.kicker} · {tm("minutes", { count: story.readingMinutes })}
                    </p>
                    <h3 className="display mt-4 text-4xl sm:text-6xl">
                      <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                    </h3>
                    <p className="mt-6 font-serif text-xl leading-snug sm:text-2xl">{story.excerpt}</p>
                    <Link
                      href={`/stories/${story.slug}`}
                      className="eyebrow mt-8 inline-block border-b border-ink pb-1 hover:text-wine"
                    >
                      {tm("read")} →
                    </Link>
                    <div className="mt-10 border-t hairline pt-5">
                      <p className="eyebrow text-muted">{t("stories.inThisStory")}</p>
                      <ul className="mt-3 space-y-2">
                        {items.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/shop/${p.slug}`}
                              className="flex items-baseline justify-between gap-4 border-b border-transparent font-serif text-xl text-wine hover:border-line"
                            >
                              <span>{p.name}</span>
                              <span className="eyebrow text-muted">
                                {p.format.amount} {p.format.unit}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Selection */}
      <section className="mx-auto mt-16 max-w-[1400px] px-4 sm:px-6" aria-labelledby="selection">
        <SectionHeading
          id="selection"
          kicker={t("selection.kicker")}
          title={t("selection.title")}
          href="/shop?category=wine"
          linkLabel={t("selection.all")}
        />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 pt-10 sm:gap-x-8 lg:grid-cols-4">
          {selection.map((p, i) => (
            <li key={p.slug}>
              <ProductCard product={p} priority={i < 2} />
            </li>
          ))}
        </ul>
      </section>

      {/* Italian Food Treasures */}
      {treasuresStory && (
        <section className="mt-28 bg-ivory-deep py-20 sm:py-28" aria-labelledby="treasures">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div>
              <p className="eyebrow text-muted">{t("treasures.kicker")}</p>
              <h2 id="treasures" className="display mt-4 text-4xl sm:text-5xl">
                {t("treasures.title")}
              </h2>
              <p className="mt-6 leading-relaxed">{t("treasures.body")}</p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <Link
                  href={`/stories/${treasuresStory.slug}`}
                  className="eyebrow border-b border-ink pb-1 hover:text-wine"
                >
                  {t("treasures.story")} →
                </Link>
                <Link href="/shop?category=treasures" className="eyebrow border-b border-ink pb-1 hover:text-wine">
                  {t("treasures.shop")} →
                </Link>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-8">
              {pantry.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Producers */}
      <section className="mx-auto mt-28 max-w-[1400px] px-4 sm:px-6" aria-labelledby="producers-heading">
        <SectionHeading
          id="producers-heading"
          kicker={t("producers.kicker")}
          title={t("producers.title")}
          href="/producers"
          linkLabel={t("producers.all")}
        />
        <ul className="grid gap-x-8 gap-y-12 pt-10 md:grid-cols-3">
          {featuredProducers.map((p) => (
            <li key={p.slug}>
              <article className="group relative">
                <Photo folder="producers" slug={p.slug} alt={p.name} aspect="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" />
                <p className="eyebrow mt-5 text-muted">
                  {p.region} · {p.area}
                </p>
                <h3 className="mt-2 font-serif text-3xl font-medium text-wine">
                  <Link href={`/producers/${p.slug}`} className="after:absolute after:inset-0">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed">{p.tagline}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Trade */}
      <section className="mx-auto mt-28 max-w-[1400px] px-4 sm:px-6" aria-labelledby="trade-heading">
        <div className="grid gap-10 bg-ink px-6 py-14 text-ivory sm:px-12 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:px-16">
          <div>
            <p className="eyebrow opacity-70">{t("trade.kicker")}</p>
            <h2 id="trade-heading" className="mt-4 font-serif text-4xl font-medium leading-tight sm:text-5xl">
              {t("trade.title")}
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed opacity-85">{t("trade.body")}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/trade"
                className="eyebrow bg-ivory px-6 py-3.5 text-ink transition-colors duration-300 hover:bg-ivory-deep"
              >
                {t("trade.apply")}
              </Link>
              <Link
                href="/trade/login"
                className="eyebrow border border-ivory/60 px-6 py-3.5 transition-colors duration-300 hover:bg-ivory hover:text-ink"
              >
                {t("trade.login")}
              </Link>
            </div>
          </div>
          <ul className="self-end border-t border-ivory/25">
            {[
              t("trade.point1"),
              t("trade.point2", { size: TRADE_RULES.wineCaseSize, min: TRADE_RULES.minWineBottles }),
              t("trade.point3", { from: TRADE_RULES.discountFromBottles, rate: TRADE_RULES.discountRate * 100 }),
              t("trade.point4"),
            ].map((point) => (
              <li key={point} className="border-b border-ivory/25 py-4 text-[0.95rem]">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
