import { test, expect } from "../setup";
import { openCart } from "../utils/cart";

test("🔥 Spam ajout produit", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  const btn = page.getByRole("button", { name: /Ajouter/i }).first();

  await expect(btn).toBeVisible();

  for (let i = 0; i < 5; i++) {
    await btn.click();
    await page.waitForTimeout(150); // 🔥 sync UI
  }

  await openCart(page);

  const qty = page.getByTestId("item-quantity");

  await expect(qty).toBeVisible();

  // 🔥 CHECK QUANTITÉ (clé du test)
  await expect(qty).not.toHaveText("0");
});