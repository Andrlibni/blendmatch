import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  catalogHref,
  getFacets,
  toggle,
  type CatalogQuery,
  type FacetOption,
} from "@/lib/catalog";

type Props = { query: CatalogQuery };

export async function FilterSidebar({ query }: Props) {
  const t = await getTranslations("shop");
  const facets = getFacets(query);

  const groups: {
    key: string;
    title: string;
    options: FacetOption[];
    isActive: (v: string) => boolean;
    href: (v: string) => string;
    label: (o: FacetOption) => string;
  }[] = [
    {
      key: "type",
      title: t("filters.type"),
      options: facets.types,
      isActive: (v) => query.types.includes(v),
      href: (v) => catalogHref(query, { types: toggle(query.types, v) }),
      label: (o) => t(`types.${o.value}`),
    },
    {
      key: "producer",
      title: t("filters.producer"),
      options: facets.producers,
      isActive: (v) => query.producers.includes(v),
      href: (v) => catalogHref(query, { producers: toggle(query.producers, v) }),
      label: (o) => o.label,
    },
    {
      key: "region",
      title: t("filters.region"),
      options: facets.regions,
      isActive: (v) => query.regions.includes(v),
      href: (v) => catalogHref(query, { regions: toggle(query.regions, v) }),
      label: (o) => t.has(`regions.${o.value}`) ? t(`regions.${o.value}`) : o.label,
    },
    {
      key: "format",
      title: t("filters.format"),
      options: facets.formats,
      isActive: (v) => query.formats.includes(v),
      href: (v) => catalogHref(query, { formats: toggle(query.formats, v) }),
      label: (o) => o.label,
    },
    {
      key: "presidio",
      title: t("filters.presidio"),
      options: facets.presidio,
      isActive: (v) => query.presidio === v,
      href: (v) =>
        catalogHref(query, { presidio: query.presidio === v ? undefined : (v as "yes" | "no") }),
      label: (o) => t(`filters.presidio_${o.value}`),
    },
  ];

  return (
    <div className="space-y-9">
      {groups.map((group) => (
        <section key={group.key} aria-labelledby={`filter-${group.key}`}>
          <h2 id={`filter-${group.key}`} className="eyebrow border-b hairline pb-3">
            {group.title}
          </h2>
          <ul className="mt-3 space-y-0.5">
            {group.options.map((o) => {
              const active = group.isActive(o.value);
              const disabled = o.count === 0 && !active;
              return (
                <li key={o.value}>
                  {disabled ? (
                    <span className="flex items-center gap-3 py-1.5 text-sm text-muted/60">
                      <Box active={false} />
                      <span className="flex-1">{group.label(o)}</span>
                      <span className="tabular-nums">0</span>
                    </span>
                  ) : (
                    <Link
                      href={group.href(o.value)}
                      scroll={false}
                      aria-current={active ? "true" : undefined}
                      className="group flex items-center gap-3 py-1.5 text-sm hover:text-wine"
                    >
                      <Box active={active} />
                      <span className="flex-1">
                        {group.label(o)}
                        {active && <span className="sr-only"> ({t("filters.selected")})</span>}
                      </span>
                      <span className="tabular-nums text-muted">{o.count}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Box({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-3 shrink-0 border transition-colors duration-200 ${
        active ? "border-ink bg-ink" : "border-ink/50 group-hover:border-wine"
      }`}
    />
  );
}
