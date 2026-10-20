import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidItalianVat, isValidNorwegianOrgNumber } from "../lib/vat/checksum";
import { normalizeVat, vatPatterns } from "../lib/vat/formats";

test("Italian Partita IVA checksum", () => {
  assert.ok(isValidItalianVat("00743110157"));
  assert.ok(!isValidItalianVat("00743110158"));
  assert.ok(!isValidItalianVat("00000000000"));
  assert.ok(!isValidItalianVat("1234"));
});

test("Norwegian organisation number", () => {
  assert.ok(isValidNorwegianOrgNumber("923609016MVA"));
  assert.ok(!isValidNorwegianOrgNumber("923609017"));
});

test("per-country formats after normalisation", () => {
  const valid: [keyof typeof vatPatterns, string][] = [
    ["DE", "de 811 569 869"],
    ["NL", "NL123456789B01"],
    ["AT", "ATU12345678"],
    ["SE", "SE556036079301"],
    ["GB", "GB 553 5578 81"],
    ["IE", "IE6388047V"],
    ["BE", "BE0123456789"],
    ["DK", "DK-13585628"],
    ["FI", "FI 2009 6234"],
  ];
  for (const [c, v] of valid) assert.ok(vatPatterns[c].test(normalizeVat(c, v)), `${c} ${v}`);
  assert.ok(!vatPatterns.DK.test(normalizeVat("DK", "DK1234567")));
  assert.ok(!vatPatterns.SE.test(normalizeVat("SE", "SE556036079302")));
});
