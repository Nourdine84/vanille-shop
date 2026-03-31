import { test, expect } from "@playwright/test";

test("💰 Calcul du total panier dynamique", async ({ page }) => {
  // 1. Aller sur produits
  await page.goto("/products");

  // 2. Ajouter un produit
  await page.getByRole("button", { name: "Ajouter" }).first().click();

  // 3. Ouvrir panier
  await page.locator('[data-testid="cart-button"]').click();

  // 4. Récupérer total initial
  const totalBefore = await page.getByTestId("cart-total").innerText();

  // 5. Augmenter quantité
  const plusBtn = page.getByText("+").first();
  await plusBtn.click();

  // 6. Vérifier que le total change
  const totalAfter = await page.getByTestId("cart-total").innerText();

  expect(totalBefore).not.toBe(totalAfter);
});