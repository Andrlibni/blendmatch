/**
 * The site is a demo: search engines are kept out unless SITE_INDEXABLE="true".
 * Set it only once every photo and text is cleared for publication.
 */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === "true";
