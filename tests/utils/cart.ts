import { Page, expect } from "@playwright/test";

/* ================= OPEN CART ================= */

export async function openCart(page: Page) {
  const cart = page.getByTestId("mini-cart").first();

  // 🔒 check visibilité réelle
  const isVisible = await cart.isVisible().catch(() => false);

  if (!isVisible) {
    const btn = page.getByTestId("cart-button");

    await expect(btn).toBeVisible();
    await btn.click();
  }

  // 🔥 attendre animation + rendu DOM
  await expect(cart).toBeVisible();
  await expect(cart).toBeAttached();
}

/* ================= ADD PRODUCT ================= */

export async function addFirstProduct(page: Page) {
  // 🔒 cibler bouton dans une carte produit uniquement
  const productCard = page.getByTestId("product-card").first();

  await expect(productCard).toBeVisible();

  const btn = productCard.getByRole("button", { name: /ajouter/i });

  await expect(btn).toBeVisible();
  await btn.click();

  // 🔥 attendre que le cart soit modifié (pas timeout)
  await page.waitForFunction(() => {
    const cart = localStorage.getItem("cart");
    return cart && JSON.parse(cart).length > 0;
  });
}