import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { legalPages } from "@/data/legal";
import { RichText } from "@/components/editorial/RichText";

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages[slug];
  return page ? { title: page.title, robots: { index: true } } : {};
}

export default async function LegalPage({ params }: PageProps<"/[locale]/legal/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = legalPages[slug];
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="display text-5xl">{page.title}</h1>
      <div className="mt-10 border-t hairline pt-10">
        <RichText text={page.body} />
      </div>
    </article>
  );
}
