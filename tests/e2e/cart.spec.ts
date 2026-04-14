import { test, expect } from "@playwright/test";
import { openCart, addFirstProduct } from "../utils/cart";

test.describe("🛒 Cart stable", () => {
  test("Ajout + ouverture + checkout", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    await addFirstProduct(page);

    await openCart(page);

    const cart = page.getByTestId("mini-cart").first();

    await expect(cart).toBeVisible();

    await expect(cart.getByTestId("cart-item")).toBeVisible();

    await cart.getByTestId("checkout-button").click();

    await page.waitForURL("**/checkout");

    await expect(page.locator("h1")).toBeVisible();
  });
});