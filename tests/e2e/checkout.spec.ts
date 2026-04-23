import { test, expect } from "../setup";
import { openCart, addFirstProduct } from "../utils/cart";

test.beforeEach(async ({ page }) => {

  // 🔥 MOCK CHECKOUT GLOBAL
  await page.route("**/api/checkout-session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url: "/checkout" }),
    });
  });

  await page.goto("/");

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test("Checkout flow stable", async ({ page }) => {
  await page.goto("/products");

  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");

  await expect(page.getByTestId("product-card").first()).toBeVisible();

  await addFirstProduct(page);
  await openCart(page);

  const cart = page.getByTestId("mini-cart").first();

  await expect(cart).toBeVisible();

  await expect(cart.getByTestId("cart-item").first()).toBeVisible({
    timeout: 5000,
  });

  await Promise.all([
    page.waitForURL(/\/checkout/, { timeout: 10000 }),
    cart.getByTestId("checkout-button").click(),
  ]);

  await expect(page.locator("h1")).toBeVisible();
});