import { test, expect } from "@playwright/test";

test("🛒 Ajout multiple produits", async ({ page }) => {
  await page.goto("/products");

  const addButtons = page.getByRole("button", { name: "Ajouter" });

  await addButtons.nth(0).click();
  await addButtons.nth(1).click();
  await page.getByTestId("cart-overlay").click(); // 🔥

  await page.locator('[data-testid="cart-button"]').click();

  const items = page.getByTestId("cart-item");
  await expect(items).toHaveCount(2);
});