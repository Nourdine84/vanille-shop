import { test, expect } from "@playwright/test";
import { openCart } from "../utils/cart";

test("🧭 Navigation header", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Produits" }).click();
  await expect(page).toHaveURL("/products");
  await page.getByTestId("nav-products").click();

  await page.getByRole("link", { name: "Vanille’Or" }).click();
  await expect(page).toHaveURL("/");
});