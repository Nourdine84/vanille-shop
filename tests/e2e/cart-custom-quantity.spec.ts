import { test, expect } from "../setup";
import { openCart } from "../utils/cart";

test("🔢 Ajout avec quantité personnalisée", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  const plus = page.getByTestId("increase-qty").first();
  const plusExists = (await plus.count()) > 0;

  if (!plusExists) {
    test.skip(true, "Quantité personnalisée non disponible sur la grille produits");
    return;
  }

  await plus.click();
  await plus.click();

  await page.getByRole("button", { name: /Ajouter/i }).first().click();

  await openCart(page);

  await expect(page.getByTestId("item-quantity")).toBeVisible();
});