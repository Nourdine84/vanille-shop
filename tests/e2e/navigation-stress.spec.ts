import { test, expect } from "../setup";
import { openCart } from "../utils/cart";

test("⚡ Navigation rapide utilisateur", async ({ page }) => {
  await page.goto("/");

  await page.goto("/products");
  await page.goto("/vanille");
  await page.goto("/blog");
  await page.goto("/products");

  await expect(page).toHaveURL("/products");
});