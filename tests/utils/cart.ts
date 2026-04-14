import { Page, expect } from "@playwright/test";

export async function openCart(page: Page) {
  const cart = page.getByTestId("mini-cart");

  if (!(await cart.first().isVisible())) {
    await page.getByTestId("cart-button").click();
  }

  await expect(cart.first()).toBeVisible();
}

export async function addFirstProduct(page: Page) {
  await page.getByRole("button", { name: "Ajouter" }).first().click();
}