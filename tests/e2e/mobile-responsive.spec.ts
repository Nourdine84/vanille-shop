import { test, expect } from "@playwright/test";

test.describe("📱 Responsive mobile", () => {
  test("Navigation mobile produits → panier", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Nos produits")).toBeVisible();

    await page.getByRole("button", { name: "Ajouter" }).first().click();

    // si le mini-cart s’ouvre déjà, on le garde
    const miniCart = page.getByTestId("mini-cart");
    if (!(await miniCart.isVisible())) {
      await page.getByTestId("cart-button").click();
    }

    await expect(page.getByText("Votre panier")).toBeVisible();
    await expect(page.getByTestId("checkout-button")).toBeVisible();
  });

  test("Page checkout visible sur mobile", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Finalisation de votre commande")).toBeVisible();
  });
});