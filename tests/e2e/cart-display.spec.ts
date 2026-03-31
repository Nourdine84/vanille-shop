import { test, expect } from "@playwright/test";

test("📦 Affichage produit dans mini-cart", async ({ page }) => {
  await page.goto("/products");

  await page.getByTestId("cart-overlay").click();
  await page.getByRole("button", { name: "Ajouter" }).first().click();
  await page.locator('[data-testid="cart-button"]').click();

  await expect(page.getByTestId("cart-item")).toBeVisible();
});