import { test, expect } from "../setup";
import { openCart, addFirstProduct } from "../utils/cart";

test.describe("🛒 Cart stable", () => {
  test("Ajout + ouverture + checkout", async ({ page }) => {

    // 🔥 MOCK CHECKOUT (CRITIQUE)
    await page.route("**/api/create-checkout-session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "/checkout" }),
      });
    });

    await page.goto("/products");

    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("product-card").first()).toBeVisible();

    await addFirstProduct(page);
    await openCart(page);

    const cart = page.getByTestId("mini-cart");

    await expect(cart).toBeVisible();

    await expect(cart.getByTestId("cart-item").first()).toBeVisible({
      timeout: 5000,
    });

    // 🔥 FIX NAVIGATION
    await Promise.all([
      page.waitForURL(/\/checkout/, { timeout: 10000 }),
      cart.getByTestId("checkout-button").click(),
    ]);

    await expect(page.locator("h1")).toBeVisible();
  });
});