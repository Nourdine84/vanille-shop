import { test, expect } from "../setup";
import { openCart, addFirstProduct } from "../utils/cart";

test("Suppression produit panier", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await addFirstProduct(page);
  await openCart(page);

  await page.getByTestId("remove-item").first().click();

  await expect(page.getByTestId("cart-empty")).toBeVisible();
});