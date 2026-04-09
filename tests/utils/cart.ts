import { expect, Page } from "@playwright/test";

export async function openCart(page: Page) {
  const cart = page.getByTestId("mini-cart").first();

  if (!(await cart.isVisible())) {
    await page.getByTestId("cart-button").click();
  }

  await expect(cart).toBeVisible();
}

export async function addFirstProduct(page: Page) {
  await page.getByRole("button", { name: "Ajouter" }).first().click();
}