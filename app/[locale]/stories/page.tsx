import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { stories } from "@/data/stories";
import { Photo } from "@/components/editorial/Photo";
import { StoryCard } from "@/components/editorial/StoryCard";

export async function generateMetadata({ params }: PageProps<"/[locale]/stories">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stories" });
  return { title: t("title"), description: t("description") };
}

export default async function StoriesPage({ params }: PageProps<"/[locale]/stories">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stories");
  const [lead, ...rest] = stories;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <header className="border-b hairline pb-12 pt-12 text-center sm:pt-16">
        <p className="eyebrow text-muted">{t("kicker")}</p>
        <h1 className="display mt-5 text-5xl sm:text-6xl">{t("title")}</h1>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">{t("description")}</p>
      </header>

      <article className="group relative grid items-center gap-8 border-b hairline py-14 md:grid-cols-[1.3fr_1fr] md:gap-16">
        <Photo folder="stories" slug={lead.slug} alt={lead.title} aspect="aspect-[4/3]" priority sizes="(min-width: 768px) 60vw, 100vw" />
        <div>
          <p className="eyebrow text-muted">
            {lead.kicker} · {t("minutes", { count: lead.readingMinutes })}
          </p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">
            <Link href={`/stories/${lead.slug}`} className="after:absolute after:inset-0">
              {lead.title}
            </Link>
          </h2>
          <p className="mt-5 font-serif text-xl leading-snug">{lead.excerpt}</p>
          <span className="eyebrow mt-8 inline-block border-b border-ink pb-1">{t("read")} →</span>
        </div>
      </article>

      <ul className="grid gap-x-8 gap-y-16 pt-14 md:grid-cols-3">
        {rest.map((s) => (
          <li key={s.slug}>
            <StoryCard story={s} minutesLabel={t("minutes", { count: s.readingMinutes })} />
          </li>
        ))}
      </ul>
    </div>
  );
}
