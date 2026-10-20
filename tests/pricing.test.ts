import { test } from "node:test";
import assert from "node:assert/strict";
import { computeCart } from "../lib/pricing";

const wine = (slug: string, qty: number) => ({ slug, qty });

test("retail: free shipping from €120, flat fee below", () => {
  const small = computeCart([wine("frappato-lucerta", 2)], { kind: "retail" });
  assert.equal(small.subtotal, 42);
  assert.equal(small.shipping, 12);
  assert.equal(small.total, 54);
  assert.equal(small.freeShippingRemaining, 78);

  const big = computeCart([wine("ribolla-gialla-anfora", 4)], { kind: "retail" });
  assert.equal(big.subtotal, 136);
  assert.equal(big.shipping, 0);
});

test("trade: minimum 12 bottles and full cases of 6", () => {
  const s = computeCart([wine("frappato-lucerta", 8)], { kind: "trade", country: "DE" });
  assert.deepEqual(
    s.issues.map((i) => i.code),
    ["minWine", "wineCase"],
  );
  const ok = computeCart(
    [wine("frappato-lucerta", 7), wine("terrano-bora", 5)],
    { kind: "trade", country: "DE" },
  );
  assert.equal(ok.issues.length, 0, "mixed cases are allowed");
});

test("trade: pantry must respect its own case size", () => {
  const s = computeCart(
    [wine("frappato-lucerta", 12), { slug: "colatura-di-alici-di-cetara", qty: 6 }],
    { kind: "trade", country: "DE" },
  );
  assert.deepEqual(s.issues.map((i) => i.code), ["pantryCase"]);
});

test("trade: 5% discount on wine only from 36 bottles", () => {
  const s = computeCart(
    [wine("frappato-lucerta", 36), { slug: "colatura-di-alici-di-cetara", qty: 12 }],
    { kind: "trade", country: "DE" },
  );
  assert.equal(s.discountRate, 0.05);
  assert.equal(s.discount, Math.round(36 * 10.8 * 0.05 * 100) / 100);
  const below = computeCart([wine("frappato-lucerta", 30)], { kind: "trade", country: "DE" });
  assert.equal(below.discount, 0);
});

test("trade VAT: IT 22% (food at its own rate), EU reverse charge, UK/NO export", () => {
  const lines = [wine("frappato-lucerta", 12), { slug: "pomodorino-del-piennolo-del-vesuvio", qty: 6 }];
  const it = computeCart(lines, { kind: "trade", country: "IT" });
  assert.equal(it.regime, "domestic");
  assert.deepEqual(it.vat.map((v) => v.rate), [0.22, 0.04]);
  assert.equal(it.vat[0].amount, Math.round(12 * 10.8 * 0.22 * 100) / 100);

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
