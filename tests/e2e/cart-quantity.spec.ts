import { test, expect } from "@playwright/test";

test("Augmenter quantité produit", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  await page.getByTestId("cart-button").click();

  await expect(page.getByText("Votre panier")).toBeVisible();

  await page.getByRole("button", { name: "+" }).first().click();

  // 🔥 FIX STABLE
  await expect(page.getByTestId("item-quantity")).toHaveText("2");
});