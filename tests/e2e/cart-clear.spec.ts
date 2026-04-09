import { test, expect } from "@playwright/test";

test("🧹 Vider le panier", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  // 🔥 ouvrir panier proprement
  await page.getByTestId("cart-button").click();

  // 🔥 attendre UI
  await expect(page.getByTestId("cart-item")).toBeVisible();

  await page.getByTestId("remove-item").click();

  await expect(page.getByTestId("empty-cart")).toBeVisible();
});