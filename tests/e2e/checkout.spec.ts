import { test, expect } from "@playwright/test";

test("Accès checkout", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  const miniCart = page.getByTestId("mini-cart");

  if (!(await miniCart.isVisible())) {
    await page.getByTestId("cart-button").click();
  }

  await page.getByTestId("checkout-button").click();
  await page.waitForURL("**/checkout");

  await expect(
    page.getByText("Finalisation de votre commande")
  ).toBeVisible();
});