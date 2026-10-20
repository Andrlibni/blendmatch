import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  catalogHref,
  parseCatalogQuery,
  quickCategories,
  searchCatalog,
  sortOptions,
  type SortOption,
} from "@/lib/catalog";
import { getTradeInfo } from "@/lib/shop-context";
import { getProducer } from "@/data/producers";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { SortSelect } from "@/components/catalog/SortSelect";
import { Pagination } from "@/components/catalog/Pagination";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[locale]/shop">): Promise<Metadata> {
  const { locale } = await params;
  const query = parseCatalogQuery(await searchParams);
  const t = await getTranslations({ locale, namespace: "shop" });
  const title = query.category ? t(`quick.${query.category}`) : t("title");
  return {
    title,
    description: t("description"),
    alternates: { canonical: `/${locale}${catalogHref(query, { page: query.page })}` },
  };
}

export default async function ShopPage({ params, searchParams }: PageProps<"/[locale]/shop">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = parseCatalogQuery(await searchParams);
  const [t, trade] = await Promise.all([getTranslations("shop"), getTradeInfo()]);

  const result = searchCatalog(query, (p) => (trade ? p.tradePrice : p.retailPrice));
  const title = query.category ? t(`quick.${query.category}`) : t("title");

  const activeFilters = [
    ...query.types.map((v) => ({
      label: t(`types.${v}`),
      href: catalogHref(query, { types: query.types.filter((x) => x !== v) }),
    })),
    ...query.producers.map((v) => ({
      label: getProducer(v)?.name ?? v,
      href: catalogHref(query, { producers: query.producers.filter((x) => x !== v) }),
    })),
    ...query.regions.map((v) => ({
      label: t.has(`regions.${v}`) ? t(`regions.${v}`) : v,
      href: catalogHref(query, { regions: query.regions.filter((x) => x !== v) }),
    })),
    ...query.formats.map((v) => ({
      label: v,
      href: catalogHref(query, { formats: query.formats.filter((x) => x !== v) }),
    })),
    ...(query.presidio
      ? [
          {
            label: t(`filters.presidio_${query.presidio}`),
            href: catalogHref(query, { presidio: undefined }),
          },
        ]
      : []),
    ...(query.q ? [{ label: `“${query.q}”`, href: catalogHref(query, { q: "" }) }] : []),
  ];

  const sortHrefs = Object.fromEntries(
    sortOptions.map((s) => [s, catalogHref(query, { sort: s, page: 1 })]),
  ) as Record<SortOption, string>;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      {/* Title, description and quick categories */}
      <header className="border-b hairline pb-8 pt-12 text-center sm:pt-16">
        <nav aria-label={t("breadcrumb")} className="eyebrow text-muted">
          <Link href="/" className="hover:text-wine">
            Lento
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{t("title")}</span>
        </nav>
        <h1 className="display mt-6 text-5xl sm:text-6xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
          {t("description")}
        </p>
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          <li>
            <QuickLink href="/shop" active={!query.category} label={t("quick.all")} />
          </li>
          {quickCategories.map((c) => (
            <li key={c}>
              <QuickLink
                href={catalogHref(
                  { ...query, types: [], presidio: undefined },
                  { category: query.category === c ? undefined : c },
                )}
                active={query.category === c}
                label={t(`quick.${c}`)}
              />
            </li>
          ))}
        </ul>
      </header>

      <div className="grid gap-10 pt-8 lg:grid-cols-[230px_1fr] lg:gap-14">
        {/* Filters: drawer on mobile, sidebar on desktop */}
        <aside aria-label={t("filters.title")}>
          <details className="group border-b hairline pb-4 lg:hidden">
            <summary className="eyebrow flex cursor-pointer list-none items-center justify-between py-2">
              <span>
                {t("filters.title")}
                {activeFilters.length > 0 && ` (${activeFilters.length})`}
              </span>
              <span aria-hidden="true" className="transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="pt-6">
              <FilterSidebar query={query} />
            </div>
          </details>
          <div className="hidden lg:block">
            <FilterSidebar query={query} />
          </div>
        </aside>

        <section aria-labelledby="results-heading">
          {/* Toolbar: count, search, sort */}
          <div className="flex flex-col gap-5 border-b hairline pb-5 md:flex-row md:items-center md:justify-between">
            <h2 id="results-heading" className="eyebrow" aria-live="polite">
              {t("results", { count: result.total })}
            </h2>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <form action={`/${locale}/shop`} method="get" role="search" className="flex items-center">
                {query.category && <input type="hidden" name="category" value={query.category} />}
                {query.sort !== "relevance" && <input type="hidden" name="sort" value={query.sort} />}
                <label htmlFor="catalog-q" className="sr-only">
                  {t("search.label")}
                </label>
                <input
                  id="catalog-q"
                  name="q"
                  type="search"
                  defaultValue={query.q}
                  placeholder={t("search.placeholder")}
                  className="w-full border-b border-ink bg-transparent py-1 text-sm placeholder:text-muted sm:w-56"
                />
                <button type="submit" className="eyebrow ml-3 hover:text-wine">
                  {t("search.submit")}
                </button>
              </form>
              <SortSelect value={query.sort} hrefs={sortHrefs} />
            </div>
          </div>

          {activeFilters.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2 pt-5" aria-label={t("filters.active")}>
              {activeFilters.map((f) => (
                <li key={f.href + f.label}>
                  <Link
                    href={f.href}
                    scroll={false}
                    className="eyebrow inline-flex items-center gap-2 border hairline px-3 py-1.5 hover:border-ink"
                  >
                    {f.label}
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">{t("filters.remove")}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={query.category ? `/shop?category=${query.category}` : "/shop"}
                  className="eyebrow ml-2 underline underline-offset-4 hover:text-wine"
                >
                  {t("filters.clear")}
                </Link>
              </li>
            </ul>
          )}

          {result.items.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-14 pt-10 sm:gap-x-8 xl:grid-cols-3">
              {result.items.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard product={p} priority={i < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-24 text-center">
              <p className="font-serif text-3xl text-wine">{t("empty.title")}</p>
              <p className="mt-3 text-sm text-muted">{t("empty.body")}</p>
              <Link href="/shop" className="eyebrow mt-8 inline-block border border-ink px-6 py-3 hover:bg-ink hover:text-ivory">
                {t("filters.clear")}
              </Link>
            </div>
          )}

          <Pagination query={query} page={result.page} pageCount={result.pageCount} />
        </section>
      </div>
    </div>
  );
}

function QuickLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`eyebrow border-b pb-1 text-[0.75rem] transition-colors duration-300 ${
        active ? "border-ink" : "border-transparent hover:border-ink/40"
      }`}
    >
      {label}
    </Link>
  );
}
