import { test, expect } from "../setup";
import { openCart } from "../utils/cart";

test("🔥 Spam ajout produit", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  const btn = page.getByRole("button", { name: /Ajouter/i }).first();

  await expect(btn).toBeVisible();

  for (let i = 0; i < 5; i++) {
    await btn.click();
  }

  await openCart(page);

  await expect(page.getByTestId("cart-item")).toBeVisible();
  await expect(page.getByTestId("item-quantity")).toBeVisible();
});