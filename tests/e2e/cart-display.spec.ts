import { test, expect } from "../setup";
import { openCart, addFirstProduct } from "../utils/cart";

test("📦 Affichage produit dans mini-cart", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await addFirstProduct(page);
  await openCart(page);

  const cart = page.getByTestId("mini-cart");

  await expect(cart).toBeVisible();
  await expect(cart.getByTestId("cart-item")).toHaveCount(1);
});