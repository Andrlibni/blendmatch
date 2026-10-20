import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { catalogHref, type CatalogQuery } from "@/lib/catalog";

export async function Pagination({
  query,
  page,
  pageCount,
}: {
  query: CatalogQuery;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const t = await getTranslations("shop.pagination");
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const cls = "eyebrow inline-flex min-w-10 justify-center px-2 py-2";

  return (
    <nav aria-label={t("label")} className="mt-16 flex items-center justify-center gap-1 border-t hairline pt-8">
      {page > 1 && (
        <Link href={catalogHref(query, { page: page - 1 })} className={`${cls} hover:text-wine`}>
          ← {t("prev")}
        </Link>
      )}
      {pages.map((p) =>
        p === page ? (
          <span key={p} aria-current="page" className={`${cls} border-b border-ink`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={catalogHref(query, { page: p })} className={`${cls} hover:text-wine`}>
            {p}
          </Link>
        ),
      )}
      {page < pageCount && (
        <Link href={catalogHref(query, { page: page + 1 })} className={`${cls} hover:text-wine`}>
          {t("next")} →
        </Link>
      )}
    </nav>
  );
}
