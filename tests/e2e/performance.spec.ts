import { test, expect } from "../setup";
import { openCart } from "../utils/cart";

test("⚡ Temps chargement produits", async ({ page }) => {
  const start = Date.now();

  await page.goto("/products");

  const end = Date.now();

  const loadTime = end - start;

  console.log("⏱ Temps chargement:", loadTime);

  expect(loadTime).toBeLessThan(3000);
});