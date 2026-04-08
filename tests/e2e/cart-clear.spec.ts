import { test, expect } from "@playwright/test";

test("🧹 Vider le panier", async ({ page }) => {
  await page.goto("/products");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  // 🔥 FIX overlay sécurité
  const overlay = page.locator('[data-testid="cart-overlay"]');
  if (await overlay.isVisible().catch(() => false)) {
    await overlay.click();
  }

  await page.getByTestId("cart-button").click();

  await page.getByTestId("remove-item").click();

  await expect(page.getByTestId("empty-cart")).toBeVisible();
});