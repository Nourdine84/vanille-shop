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

test("📦 Affichage produit dans mini-cart", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  await openCart(page);

  const cart = page.getByTestId("mini-cart").first();

  await expect(cart).toBeVisible();

  await expect(
    cart.locator('[data-testid^="cart-item-"]')
  ).toHaveCount(1);
});