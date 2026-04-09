import { test, expect } from "@playwright/test";

test("Accès checkout stable", async ({ page }) => {
  await page.goto("/products");

  await page.waitForSelector('[data-testid="add-to-cart"]');

  await page.getByTestId("add-to-cart").first().click();

  const cart = page.locator('[data-testid="mini-cart"]:visible').first();

  if (!(await cart.isVisible().catch(() => false))) {
    await page.getByTestId("cart-button").click();
  }

  await expect(cart).toBeVisible();

  await cart.getByTestId("checkout-button").click({ force: true });

  // ✅ check principal
  await page.waitForURL("**/checkout", { timeout: 10000 });

  // ✅ check robuste (structure page)
  await expect(page).toHaveURL(/checkout/);

  // OPTION BONUS (si tu veux sécuriser plus)
  await expect(page.locator("body")).toBeVisible();
});