type PricingLike = {
  priceCents: number;
  pricing?: unknown;
};

export function getMinPriceCents(product: PricingLike): number {
  const pricing = product.pricing;

  if (pricing && typeof pricing === "object" && !Array.isArray(pricing)) {
    const values = Object.values(pricing as Record<string, unknown>)
      .map(Number)
      .filter((v) => !isNaN(v) && v > 0);

    if (values.length > 0) {
      return Math.min(...values);
    }
  }

  return product.priceCents;
}

export function hasMultiplePriceFormats(product: PricingLike): boolean {
  const pricing = product.pricing;

  return (
    !!pricing &&
    typeof pricing === "object" &&
    !Array.isArray(pricing) &&
    Object.keys(pricing as Record<string, unknown>).length > 1
  );
}
