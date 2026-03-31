import { test, expect } from "@playwright/test";

test("Augmenter quantité produit", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  const miniCart = page.getByTestId("mini-cart");

  if (!(await miniCart.isVisible())) {
    await page.getByTestId("cart-button").click();
  }

  await expect(page.getByText("Votre panier")).toBeVisible();

  const plusBtn = page.getByRole("button", { name: "+" }).first();
  await plusBtn.click();

  // 🔥 FIX FINAL (seul fiable)
  await expect(page.getByTestId("item-quantity")).toHaveText("2");
});