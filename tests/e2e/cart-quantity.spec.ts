import { test, expect } from "../setup";
import { openCart, addFirstProduct } from "../utils/cart";

test("Augmenter quantité produit", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await addFirstProduct(page);
  await openCart(page);

  const plus = page.getByTestId("increase-qty").first();

  await plus.click();

  await expect(page.getByTestId("item-quantity")).toHaveText("2");
});