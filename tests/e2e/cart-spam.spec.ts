import { test, expect } from "@playwright/test";

test("🔥 Spam ajout produit", async ({ page }) => {
  await page.goto("/products");

  const btn = page.getByRole("button", { name: "Ajouter" }).first();

  for (let i = 0; i < 5; i++) {
    await btn.click();
  }

  await page.getByTestId("cart-overlay").click();
  await page.getByTestId("cart-button").click();

  await expect(page.getByTestId("cart-item")).toBeVisible();
});