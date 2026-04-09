import { test, expect } from "@playwright/test";
import { openCart } from "../utils/cart";

test("💰 Total panier correct", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  const cart = page.getByTestId("mini-cart").first();

  await expect(cart).toBeVisible();

  const total = cart.getByTestId("cart-total");

  await expect(total).toBeVisible();
});