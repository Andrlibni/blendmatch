import { setRequestLocale } from "next-intl/server";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-24 text-center sm:px-6">
      <h1 className="display text-5xl sm:text-7xl">Lento</h1>
    </section>
  );
}
