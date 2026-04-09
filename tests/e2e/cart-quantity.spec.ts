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

test("Augmenter quantité produit", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  await openCart(page);

  const cart = page.getByTestId("mini-cart").first();

  // bouton "+" scoped dans le cart
  await cart.getByRole("button", { name: "+" }).first().click();

  // ✅ stable + scoped
  await expect(cart.getByTestId("item-quantity")).toHaveText("2");
});