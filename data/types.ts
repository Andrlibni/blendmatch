export type WineCategory = "orange" | "white" | "red" | "sparkling";
export type ProductCategory = WineCategory | "pantry";

export type Format = {
  amount: number;
  unit: "cl" | "ml" | "g";
};

type BaseProduct = {
  slug: string;
  name: string;
  /** Producer slug, see data/producers.ts */
  producer: string;
  category: ProductCategory;
  region: string;
  /** Village, valley or sub-zone. */
  area: string;
  format: Format;
  /** Units per trade case. Wine is always 6 (mixable). */
  caseSize: number;
  /** EUR, VAT and excise included. Shown to private customers. */
  retailPrice: number;
  /** EUR, ex VAT. Shown to approved trade accounts only. */
  tradePrice: number;
  /** Italian VAT rate used for domestic trade invoices. */
  vatRateIT: number;
  isNew?: boolean;
  featured?: boolean;
  /** Name of the Slow Food Presìdio, when the product belongs to one. */
  presidio?: string;
  /** One line used on cards and in meta descriptions. */
  short: string;
  tastingNote: string;
  /** A few paragraphs on where the product comes from. */
  story: string;
  pairing?: string;
};

export type WineProduct = BaseProduct & {
  kind: "wine";
  category: WineCategory;
  grapes: string[];
  /** Denomination as on the label, e.g. "Barolo DOCG". */
  appellation: string;
  /** Current vintage, when known. */
  vintage?: number;
  vinification: string;
  soil?: string;
  /** Total SO₂ in mg/l; omitted when the producer has not shared it. */
  so2Total?: number;
  /** Alcohol by volume, %; omitted when it varies by vintage and is not confirmed. */
  abv?: number;
};

export type PantryProduct = BaseProduct & {
  kind: "pantry";
  category: "pantry";
  ingredients: string;
  shelfLife: string;
};

export type Product = WineProduct | PantryProduct;

export type Producer = {
  slug: string;
  name: string;
  region: string;
  area: string;
  founded?: number;
  /** Featured producers get a full page with story and portrait. */
  featured: boolean;
  /** One line for lists. */
  tagline: string;
  /** Paragraphs separated by blank lines. */
  story: string;
  hectares?: number;
  farming: string;
};

export type Story = {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  /** Paragraphs separated by blank lines; lines starting with "## " are headings. */
  body: string;
  producer?: string;
  products: string[];
  readingMinutes: number;
};
