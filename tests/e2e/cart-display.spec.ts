import { test, expect } from "@playwright/test";

test("📦 Affichage produit dans mini-cart", async ({ page }) => {
  await page.goto("/products");

  await page.getByRole("button", { name: /Ajouter/i }).first().click();

  await page.getByTestId("cart-button").click();

  // 🔥 FIX STRICT MODE
  const cart = page.locator('[data-testid="mini-cart"]').first();

  await expect(cart).toBeVisible();

  await expect(
    cart.locator('[data-testid^="cart-item-"]')
  ).toHaveCount(1);
});