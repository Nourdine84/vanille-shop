import { test, expect } from "@playwright/test";

test.describe("🛒 Parcours panier VanilleOr", () => {
  test("Ajout produit + ouverture panier + checkout", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Nos produits")).toBeVisible();

    await page.getByRole("button", { name: "Ajouter" }).first().click();

    const miniCart = page.getByTestId("mini-cart");

    if (!(await miniCart.isVisible())) {
      await page.getByTestId("cart-button").click();
    }

    await expect(page.getByText("Votre panier")).toBeVisible();
    await expect(page.getByTestId("cart-item")).toBeVisible();

    await page.getByTestId("checkout-button").click();
    await page.waitForURL("**/checkout");

    await expect(
      page.getByText("Finalisation de votre commande")
    ).toBeVisible();
  });
});