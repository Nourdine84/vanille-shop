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

test("Accès checkout stable", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  // ajouter produit
  await page.getByRole("button", { name: "Ajouter" }).first().click();

  // ouvrir panier
  await openCart(page);

  const cart = page.getByTestId("mini-cart").first();

  // checkout
  await cart.getByTestId("checkout-button").click();

  await page.waitForURL("**/checkout");

  // ✅ robuste (évite dépendance texte fragile)
  await expect(page.locator("h1")).toBeVisible();
});