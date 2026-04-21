import { test, expect } from "@playwright/test";
import { openCart, addFirstProduct } from "../utils/cart";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("Checkout flow stable", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await addFirstProduct(page);
  await openCart(page);

  const cart = page.getByTestId("mini-cart").first();

  await expect(cart).toBeVisible();

  await cart.getByTestId("checkout-button").click();

  // 🔥 Gère les 2 cas : checkout page OU Stripe
  await Promise.race([
    page.waitForURL("**/checkout", { timeout: 8000 }),
    page.waitForURL("**stripe.com**", { timeout: 8000 }),
  ]);

  // Si on reste sur ton site
  if (page.url().includes("/checkout")) {
    await expect(page.locator("h1")).toBeVisible();
  }
});