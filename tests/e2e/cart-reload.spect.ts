import { test, expect } from "@playwright/test";

test("🔄 Reload page panier", async ({ page }) => {
  await page.goto("/products");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  await page.reload();

  await page.getByTestId("cart-button").click();

  // ⚠️ probablement FAIL → normal (pas encore persisté)
  await expect(page.getByTestId("cart-item")).toBeVisible();
});