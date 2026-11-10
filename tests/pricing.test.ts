import { test } from "node:test";
import assert from "node:assert/strict";
import { computeCart } from "../lib/pricing";
import { getProduct } from "../data/products";

const line = (slug: string, qty: number) => ({ slug, qty });
const price = (slug: string) => getProduct(slug)!;
const r2 = (n: number) => Math.round(n * 100) / 100;

const DOLCETTO = "cascina-fontana-dolcetto-d-alba";
const NEBBIOLO = "cascina-fontana-langhe-nebbiolo";
const BARBERA = "rinaldi-barbera-d-alba";
const COLATURA = "colatura-di-alici-di-cetara";
const PIENNOLO = "antichi-pomodori-di-napoli-pelati";

test("retail: free shipping from €120, flat fee below", () => {
  const small = computeCart([line(DOLCETTO, 2)], { kind: "retail" });
  assert.equal(small.subtotal, r2(2 * price(DOLCETTO).retailPrice));
  assert.equal(small.shipping, 12);
  assert.equal(small.total, r2(small.subtotal + 12));
  assert.equal(small.freeShippingRemaining, r2(120 - small.subtotal));

  const big = computeCart([line(NEBBIOLO, 4)], { kind: "retail" });
  assert.ok(big.subtotal >= 120);
  assert.equal(big.shipping, 0);
});

test("trade: minimum 12 bottles and full cases of 6", () => {
  const s = computeCart([line(DOLCETTO, 8)], { kind: "trade", country: "DE" });
  assert.deepEqual(s.issues.map((i) => i.code), ["minWine", "wineCase"]);
  const ok = computeCart([line(DOLCETTO, 7), line(BARBERA, 5)], { kind: "trade", country: "DE" });
  assert.equal(ok.issues.length, 0, "mixed cases are allowed");
});

test("trade: pantry must respect its own case size", () => {
  const s = computeCart([line(DOLCETTO, 12), line(COLATURA, 6)], { kind: "trade", country: "DE" });
  assert.deepEqual(s.issues.map((i) => i.code), ["pantryCase"]);
});

test("trade: 5% discount on wine only from 36 bottles", () => {
  const s = computeCart([line(DOLCETTO, 36), line(COLATURA, 12)], { kind: "trade", country: "DE" });
  assert.equal(s.discountRate, 0.05);
  assert.equal(s.discount, r2(r2(36 * price(DOLCETTO).tradePrice) * 0.05));
  const below = computeCart([line(DOLCETTO, 30)], { kind: "trade", country: "DE" });
  assert.equal(below.discount, 0);
});

test("trade VAT: IT 22% (food at its own rate), EU reverse charge, UK/NO export", () => {
  const lines = [line(DOLCETTO, 12), line(PIENNOLO, 6)];
  const it = computeCart(lines, { kind: "trade", country: "IT" });
  assert.equal(it.regime, "domestic");
  assert.deepEqual(it.vat.map((v) => v.rate), [0.22, 0.04]);
  assert.equal(it.vat[0].amount, r2(r2(12 * price(DOLCETTO).tradePrice) * 0.22));

  for (const country of ["DE", "SE", "IE"] as const) {
    const s = computeCart(lines, { kind: "trade", country });
    assert.equal(s.regime, "reverse_charge");
    assert.equal(s.vatTotal, 0);
  }
  for (const country of ["GB", "NO"] as const) {
    const s = computeCart(lines, { kind: "trade", country });
    assert.equal(s.regime, "export");
    assert.equal(s.vatTotal, 0);
  }
});

test("catalogue data: every product points to a producer and has sane prices", async () => {
  const { products } = await import("../data/products");
  const { getProducer } = await import("../data/producers");
  for (const p of products) {
    assert.ok(getProducer(p.producer), `${p.slug}: unknown producer ${p.producer}`);
    assert.ok(p.tradePrice > 0 && p.tradePrice < p.retailPrice, `${p.slug}: trade price`);
  }
  const slugs = products.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, "slugs are unique");
});

test("stories only reference existing products and producers", async () => {
  const { stories } = await import("../data/stories");
  const { getProducer } = await import("../data/producers");
  for (const s of stories) {
    for (const slug of s.products) assert.ok(getProduct(slug), `${s.slug}: unknown product ${slug}`);
    if (s.producer) assert.ok(getProducer(s.producer), `${s.slug}: unknown producer`);
  }
});
