import { test, expect } from "@playwright/test";

test("Suppression produit panier", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  const miniCart = page.getByTestId("mini-cart");

  if (!(await miniCart.isVisible())) {
    await page.getByTestId("cart-button").click();
  }

  await expect(page.getByText("Votre panier")).toBeVisible();

  await page.getByTestId("remove-item").first().click();

  await expect(page.getByTestId("empty-cart")).toBeVisible();
});