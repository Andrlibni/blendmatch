/**
 * Italian Partita IVA check digit (Luhn variant): odd positions are summed,
 * even positions are doubled (minus 9 when > 9); the 11th digit must bring
 * the total to a multiple of 10.
 */
export function isValidItalianVat(digits: string) {
  if (!/^\d{11}$/.test(digits) || /^0{11}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let d = Number(digits[i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return (10 - (sum % 10)) % 10 === Number(digits[10]);
}

/** Norwegian organisation number, modulus 11 with weights 3 2 7 6 5 4 3 2. */
export function isValidNorwegianOrgNumber(value: string) {
  const digits = value.replace(/MVA$/, "");
  if (!/^\d{9}$/.test(digits)) return false;
  const weights = [3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((acc, w, i) => acc + w * Number(digits[i]), 0);
  const rest = sum % 11;
  const check = rest === 0 ? 0 : 11 - rest;
  return check !== 10 && check === Number(digits[8]);
}
