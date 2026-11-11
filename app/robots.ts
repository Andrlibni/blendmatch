import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { SITE_INDEXABLE } from "@/lib/indexing";

export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/*/admin", "/*/cart", "/*/checkout", "/*/order/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
