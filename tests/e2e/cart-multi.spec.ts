import { test, expect } from "../setup";
import { openCart } from "../utils/cart";

test("🛒 Ajout multiple produits", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  const addButtons = page.getByRole("button", { name: /Ajouter/i });

  await expect(addButtons.first()).toBeVisible();

  await addButtons.nth(0).click();
  await page.waitForTimeout(200);

  await addButtons.nth(1).click();
  await page.waitForTimeout(300);

  await openCart(page);

  await expect(page.getByTestId("cart-item")).toHaveCount(2);
});