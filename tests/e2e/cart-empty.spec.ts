import { test, expect } from "../setup";

test("Panier vide", async ({ page }) => {
  await page.goto("/products");

  await page.getByTestId("cart-button").click();

  await expect(page.getByTestId("cart-empty")).toBeVisible();
});