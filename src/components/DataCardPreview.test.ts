import { expect, test } from "bun:test";
import { formatMoneyEUR, normalizeFinanceValue } from "./DataCardPreview";

test("invalid finance values are omitted", () => {
  for (const value of [NaN, Infinity, -Infinity, "", " ", false, {}]) expect(normalizeFinanceValue(value)).toBeUndefined();
});
test("negative amounts use minus sign and absolute magnitude", () => {
  expect(formatMoneyEUR(-1234567)).toBe("−\u00a01.2 mil. €");
});
test("thousands and millions round to one decimal", () => {
  expect(formatMoneyEUR(12500)).toBe("12.5 tis. €");
  expect(formatMoneyEUR(1250000)).toBe("1.3 mil. €");
});
test("plain small amounts keep euro units", () => {
  expect(formatMoneyEUR(999)).toBe("999 €");
});