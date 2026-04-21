import { test, expect } from "../setup";
import { openCart, addFirstProduct } from "../utils/cart";

test("🧠 Persistance panier entre pages", async ({ page }) => {
  await page.goto("/products");

  await addFirstProduct(page);
  await openCart(page);

  await page.getByTestId("increase-qty").click();

  await expect(page.getByTestId("item-quantity")).toHaveText("2");

  await page.goto("/checkout");

  await expect(page.getByText("2")).toBeVisible();
});