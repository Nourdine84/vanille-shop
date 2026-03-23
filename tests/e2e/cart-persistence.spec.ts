import { test, expect } from "@playwright/test";

test("🧠 Persistance panier entre pages", async ({ page }) => {
  // 1. Aller sur produits
  await page.goto("/products");

  // 2. Ajouter un produit
  await page.getByRole("button", { name: "Ajouter" }).first().click();

  // 3. Ouvrir le panier
  await page.locator('[data-testid="cart-button"]').click();

  // 4. Augmenter quantité
  const plusBtn = page.getByText("+").first();
  await plusBtn.click();

  // 5. Vérifier quantité = 2
  await expect(page.getByTestId("item-quantity")).toHaveText("2");

  // 6. Aller au checkout
  await page.getByTestId("checkout-button").click();

  // 7. Vérifier que la quantité est toujours 2
  await expect(page.getByText("Quantité : 2")).toBeVisible();
});