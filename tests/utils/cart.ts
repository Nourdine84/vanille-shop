import { Page, expect } from "@playwright/test";

export async function openCart(page: Page) {
  const cart = page.getByTestId("mini-cart");

  const isVisible = await cart.first().isVisible().catch(() => false);

  if (!isVisible) {
    const btn = page.getByTestId("cart-button");

    await expect(btn).toBeVisible();
    await btn.click();
  }

  await expect(cart.first()).toBeVisible();
}

export async function addFirstProduct(page: Page) {
  const btn = page.getByRole("button", { name: /Ajouter/i }).first();

  await expect(btn).toBeVisible();
  await btn.click();

  await page.waitForFunction(() => {
    try {
      const raw = localStorage.getItem("cart") || "[]";
      const cart = JSON.parse(raw);
      return Array.isArray(cart) && cart.length > 0 && cart[0].quantity >= 1;
    } catch {
      return false;
    }
  });

  await page.waitForTimeout(100);
}