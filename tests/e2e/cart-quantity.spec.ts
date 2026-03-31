import { test, expect } from "@playwright/test";

test("Augmenter quantité produit", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  // Ajouter produit
  await page.getByRole("button", { name: "Ajouter" }).first().click();

  const miniCart = page.getByTestId("mini-cart");

  // Ouvrir panier si besoin
  if (!(await miniCart.isVisible())) {
    await page.getByTestId("cart-button").click();
  }

  await expect(page.getByText("Votre panier")).toBeVisible();

  // Bouton +
  const plusBtn = page.getByRole("button", { name: "+" }).first();
  await plusBtn.click();

  // 🔥 FIX PRO → on cible la quantité dans le cart-item
  const quantity = page.getByTestId("cart-item").locator("span").nth(1);

  await expect(quantity).toHaveText("2");

    // 🔥 FIX PRO
    await expect(page.getByTestId("item-quantity")).toHaveText("2");
});
