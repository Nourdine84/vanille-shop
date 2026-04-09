import { test, expect } from "@playwright/test";

test("🛒 Ajout multiple produits", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  const addButtons = page.getByRole("button", { name: "Ajouter" });

  await addButtons.nth(0).click();
  await addButtons.nth(1).click();

  // 🔥 fermer overlay
  const overlay = page.getByTestId("cart-overlay");
  if (await overlay.isVisible()) {
    await overlay.click();
  }

  await page.getByTestId("cart-button").click();

  await expect(page.getByTestId("cart-item")).toHaveCount(2);
});