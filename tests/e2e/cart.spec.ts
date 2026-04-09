import { test, expect, Page } from "@playwright/test";

/* =========================
   HELPERS
========================= */

async function openCart(page: Page) {
  const cart = page.getByTestId("mini-cart").first();

  if (!(await cart.isVisible())) {
    await page.getByTestId("cart-button").click();
  }

  await expect(cart).toBeVisible();
}

/* =========================
   TEST
========================= */

test.describe("🛒 Parcours panier VanilleOr", () => {
  test("Ajout produit + ouverture panier + checkout", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Nos produits")).toBeVisible();

    // ajouter produit
    await page.getByRole("button", { name: "Ajouter" }).first().click();

    await openCart(page);

    const cart = page.getByTestId("mini-cart").first();

    // ✅ titre panier
    await expect(cart.getByText("Votre panier")).toBeVisible();

    // ✅ vérifier item présent (fix réel)
    await expect(
      cart.locator('[data-testid^="cart-item-"]')
    ).toHaveCount(1);

    // checkout
    await cart.getByTestId("checkout-button").click();

    await page.waitForURL("**/checkout");

    await expect(page.locator("h1")).toBeVisible();
  });
});