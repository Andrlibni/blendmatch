import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { products } from "@/data/products";
import { producers } from "@/data/producers";
import { stories } from "@/data/stories";
import { legalPages } from "@/data/legal";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/shop",
    "/producers",
    "/stories",
    "/trade",
    ...products.map((p) => `/shop/${p.slug}`),
    ...producers.map((p) => `/producers/${p.slug}`),
    ...stories.map((s) => `/stories/${s.slug}`),
    ...Object.keys(legalPages).map((s) => `/legal/${s}`),
  ];
  return paths.map((path) => ({
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
    },
  }));
}
