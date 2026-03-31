import { test, expect } from "@playwright/test";

test("🛒 Ajout multiple produits", async ({ page }) => {
  await page.goto("/products");

  const addButtons = page.getByRole("button", { name: "Ajouter" });

  await addButtons.nth(0).click();

  // 🔥 fermer overlay si ouvert
  const overlay = page.locator('[data-testid="cart-overlay"]');
  if (await overlay.isVisible().catch(() => false)) {
    await overlay.click();
  }

  await addButtons.nth(1).click();

  if (await overlay.isVisible().catch(() => false)) {
    await overlay.click();
  }

  await page.getByTestId("cart-button").click();

  const items = page.getByTestId("cart-item");
  await expect(items).toHaveCount(2);
});