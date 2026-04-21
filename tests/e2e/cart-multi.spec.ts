import { test, expect } from "../setup";
import { openCart } from "../utils/cart";

test("🛒 Ajout multiple produits", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  const addButtons = page.getByRole("button", { name: /Ajouter/i });

  await addButtons.nth(0).click();
  await addButtons.nth(1).click();

  await openCart(page);

  await expect(page.getByTestId("cart-item")).toHaveCount(2);
});