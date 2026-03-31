import { test, expect } from "@playwright/test";

test("🔢 Ajout avec quantité personnalisée", async ({ page }) => {
  await page.goto("/products");

  // augmenter quantité avant ajout
  const plusBtn = page.getByText("+").first();
  await plusBtn.click();
  await plusBtn.click();

  // ajouter produit
  await page.getByRole("button", { name: "Ajouter" }).first().click();

  // fermer overlay
  await page.getByTestId("cart-overlay").click();

  // ouvrir panier
  await page.getByTestId("cart-button").click();

  // vérifier quantité = 3
  await expect(page.getByTestId("item-quantity")).toHaveText("3");
});