import { test, expect } from "@playwright/test";

test("📦 Affichage produit dans mini-cart", async ({ page }) => {
  await page.goto("/products");

  // 🔥 sécurité overlay
  const overlay = page.locator('[data-testid="cart-overlay"]');
  if (await overlay.isVisible().catch(() => false)) {
    await overlay.click();
  }

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  // 🔥 recheck overlay
  if (await overlay.isVisible().catch(() => false)) {
    await overlay.click();
  }

  await page.getByTestId("cart-button").click();

  await expect(page.getByTestId("cart-item")).toBeVisible();
});