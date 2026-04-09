import { test, expect } from "@playwright/test";
import { openCart, addFirstProduct } from "../utils/cart";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("Accès checkout stable", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await addFirstProduct(page);
  await openCart(page);

  const cart = page.getByTestId("mini-cart").first();

  await cart.getByTestId("checkout-button").click();

  await page.waitForURL("**/checkout");

  await expect(page.locator("h1")).toBeVisible();
});