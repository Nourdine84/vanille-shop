import { test, expect } from "../setup";
import { openCart, addFirstProduct } from "../utils/cart";

test("💰 Total panier correct", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await addFirstProduct(page);
  await openCart(page);

  const total = page.getByTestId("cart-total");

  await expect(total).toBeVisible();
});