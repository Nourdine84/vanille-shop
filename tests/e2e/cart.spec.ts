import { test, expect } from "@playwright/test";
import { openCart, addFirstProduct } from "../utils/cart";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test.describe("🛒 Parcours panier VanilleOr", () => {
  test("Ajout produit + checkout", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Nos produits")).toBeVisible();

    await addFirstProduct(page);
    await openCart(page);

    const cart = page.getByTestId("mini-cart").first();

    await expect(cart.getByText("Votre panier")).toBeVisible();

    await expect(
      cart.locator('[data-testid^="cart-item-"]')
    ).toHaveCount(1);

    await cart.getByTestId("checkout-button").click();

    await page.waitForURL("**/checkout");

    await expect(page.locator("h1")).toBeVisible();
  });
});