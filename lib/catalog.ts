import { products } from "@/data/products";
import { getProducer, producers } from "@/data/producers";
import type { Product, ProductCategory } from "@/data/types";

export const PAGE_SIZE = 12;

export const quickCategories = [
  "new",
  "orange",
  "white",
  "red",
  "sparkling",
  "pantry",
  "presidi",
] as const;
export type QuickCategory = (typeof quickCategories)[number] | "wine";

export const typeOrder: ProductCategory[] = ["orange", "white", "red", "sparkling", "pantry"];

export const sortOptions = ["relevance", "az", "price-asc", "price-desc"] as const;
export type SortOption = (typeof sortOptions)[number];

export type CatalogQuery = {
  category?: QuickCategory;
  types: string[];
  producers: string[];
  regions: string[];
  formats: string[];
  presidio?: "yes" | "no";
  q: string;
  sort: SortOption;
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean);

export function parseCatalogQuery(params: RawParams): CatalogQuery {
  const category = list(params.category)[0] as QuickCategory | undefined;
  const sort = list(params.sort)[0] as SortOption | undefined;
  const presidio = list(params.presidio)[0];
  const page = Number.parseInt(list(params.page)[0] ?? "1", 10);
  return {
    category:
      category && ([...quickCategories, "wine"] as string[]).includes(category)
        ? category
        : undefined,
    types: list(params.type),
    producers: list(params.producer),
    regions: list(params.region),
    formats: list(params.format),
    presidio: presidio === "yes" || presidio === "no" ? presidio : undefined,
    q: (list(params.q)[0] ?? "").trim().slice(0, 80),
    sort: sort && sortOptions.includes(sort) ? sort : "relevance",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function formatLabel(p: Product) {
  return `${p.format.amount} ${p.format.unit}`;
}

function matchesCategory(p: Product, category?: QuickCategory) {
  switch (category) {
    case undefined:
      return true;
    case "new":
      return !!p.isNew;
    case "presidi":
      return !!p.presidio;
    case "wine":
      return p.kind === "wine";
    default:
      return p.category === category;
  }
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function searchScore(p: Product, q: string) {
  if (!q) return 1;
  const producer = getProducer(p.producer)?.name ?? "";
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  const name = normalize(p.name);
  const haystack = normalize(
    [
      p.name,
      producer,
      p.region,
      p.area,
      p.category,
      p.presidio ?? "",
      p.kind === "wine" ? `${p.grapes.join(" ")} ${p.appellation}` : p.ingredients,
      p.short,
    ].join(" "),
  );
  let score = 0;
  for (const term of terms) {
    if (!haystack.includes(term)) return 0;
    score += name.includes(term) ? 3 : 1;
  }
  return score;
}

/** Quick categories with no products (e.g. no sparkling wine yet) are hidden. */
export function categoryHasProducts(category: QuickCategory) {
  return products.some((p) => matchesCategory(p, category));
}

type Facet = "types" | "producers" | "regions" | "formats" | "presidio";

function passes(p: Product, query: CatalogQuery, skip?: Facet) {
  if (!matchesCategory(p, query.category)) return false;
  if (skip !== "types" && query.types.length && !query.types.includes(p.category)) return false;
  if (skip !== "producers" && query.producers.length && !query.producers.includes(p.producer))
    return false;
  if (skip !== "regions" && query.regions.length && !query.regions.includes(p.region))
    return false;
  if (skip !== "formats" && query.formats.length && !query.formats.includes(formatLabel(p)))
    return false;
  if (skip !== "presidio" && query.presidio) {
    if (query.presidio === "yes" && !p.presidio) return false;
    if (query.presidio === "no" && p.presidio) return false;
  }
  return searchScore(p, query.q) > 0;
}

export type FacetOption = { value: string; label: string; count: number };

function countBy(
  query: CatalogQuery,
  facet: Facet,
  keyOf: (p: Product) => string,
  options: { value: string; label: string }[],
): FacetOption[] {
  const pool = products.filter((p) => passes(p, query, facet));
  return options.map((o) => ({
    ...o,
    count: pool.filter((p) => keyOf(p) === o.value).length,
  }));
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

export function getFacets(query: CatalogQuery) {
  const regions = unique(products.map((p) => p.region)).sort();
  const unitOrder = ["cl", "ml", "g"];
  const formats = unique(products.map(formatLabel)).sort((a, b) => {
    const [na, ua] = a.split(" ");
    const [nb, ub] = b.split(" ");
    return unitOrder.indexOf(ua) - unitOrder.indexOf(ub) || Number(na) - Number(nb);
  });
  const producerOptions = producers
    .filter((pr) => products.some((p) => p.producer === pr.slug))
    .map((pr) => ({ value: pr.slug, label: pr.name }));

  return {
    types: countBy(
      query,
      "types",
      (p) => p.category,
      typeOrder.map((t) => ({ value: t, label: t })),
    ),
    producers: countBy(query, "producers", (p) => p.producer, producerOptions),
    regions: countBy(
      query,
      "regions",
      (p) => p.region,
      regions.map((r) => ({ value: r, label: r })),
    ),
    formats: countBy(
      query,
      "formats",
      formatLabel,
      formats.map((f) => ({ value: f, label: f })),
    ),
    presidio: countBy(query, "presidio", (p) => (p.presidio ? "yes" : "no"), [
      { value: "yes", label: "yes" },
      { value: "no", label: "no" },
    ]),
  };
}

export function searchCatalog(query: CatalogQuery, priceOf: (p: Product) => number) {
  const matched = products
    .map((p, index) => ({ p, index, score: searchScore(p, query.q) }))
    .filter(({ p }) => passes(p, query));

  matched.sort((a, b) => {
    switch (query.sort) {
      case "az":
        return a.p.name.localeCompare(b.p.name);
      case "price-asc":
        return priceOf(a.p) - priceOf(b.p);
      case "price-desc":
        return priceOf(b.p) - priceOf(a.p);
      default: {
        const rank = (x: typeof a) =>
          x.score * 10 + (x.p.featured ? 2 : 0) + (x.p.isNew ? 1 : 0);
        return rank(b) - rank(a) || a.index - b.index;
      }
    }
  });

  const total = matched.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  const items = matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((m) => m.p);
  return { items, total, page, pageCount };
}

/** Builds a catalogue URL query string, dropping empty values and resetting the page. */
export function catalogHref(
  query: CatalogQuery,
  patch: Partial<CatalogQuery>,
): string {
  const next = { ...query, page: 1, ...patch };
  const sp = new URLSearchParams();
  if (next.category) sp.set("category", next.category);
  next.types.forEach((v) => sp.append("type", v));
  next.producers.forEach((v) => sp.append("producer", v));
  next.regions.forEach((v) => sp.append("region", v));
  next.formats.forEach((v) => sp.append("format", v));
  if (next.presidio) sp.set("presidio", next.presidio);
  if (next.q) sp.set("q", next.q);
  if (next.sort !== "relevance") sp.set("sort", next.sort);
  if (next.page > 1) sp.set("page", String(next.page));
  const qs = sp.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function toggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

export function relatedProducts(product: Product, limit = 4) {
  const others = products.filter((p) => p.slug !== product.slug);
  const score = (p: Product) =>
    (p.producer === product.producer ? 3 : 0) +
    (p.category === product.category ? 2 : 0) +
    (p.region === product.region ? 1 : 0);
  return others
    .map((p, i) => ({ p, i, s: score(p) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.p);
}
