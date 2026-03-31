import { test, expect } from "@playwright/test";

test("🧹 Vider le panier", async ({ page }) => {
  await page.goto("/products");

  await page.getByRole("button", { name: "Ajouter" }).first().click();
  await page.locator('[data-testid="cart-button"]').click();

  await page.getByTestId("remove-item").click();

  await expect(page.getByTestId("empty-cart")).toBeVisible();
});