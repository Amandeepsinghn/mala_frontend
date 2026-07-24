export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function parseDecimal(value: string | null | undefined): number {
  if (!value) return 0;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function parseOptionalDecimal(
  value: string | null | undefined,
): number | null {
  if (value == null || value === "") return null;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function formatDimension(value: number): string {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1).replace(/\.0$/, "");
}

export function getDiscountPercent(
  price: number,
  compareAtPrice?: number | null,
): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
