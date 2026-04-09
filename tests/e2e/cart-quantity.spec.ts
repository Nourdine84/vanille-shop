import { test, expect } from "@playwright/test";
import { openCart, addFirstProduct } from "../utils/cart";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("Augmenter quantité produit", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await addFirstProduct(page);
  await openCart(page);

  const cart = page.getByTestId("mini-cart").first();

  await cart.getByRole("button", { name: "+" }).first().click();

  await expect(cart.getByTestId("item-quantity")).toHaveText("2");
});