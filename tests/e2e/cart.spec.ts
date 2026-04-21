import { test, expect } from "../setup";
import { openCart, addFirstProduct } from "../utils/cart";

test.describe("🛒 Cart stable", () => {
  test("Ajout + ouverture + checkout", async ({ page }) => {
    await page.goto("/products");

    // 🔒 Stabilise le chargement (évite les fails random)
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");

    // 🔥 S'assure que les produits sont bien rendus
    await expect(page.getByTestId("product-card").first()).toBeVisible();

    // 👉 Ajout produit
    await addFirstProduct(page);

    // 👉 Ouvre le panier
    await openCart(page);

    const cart = page.getByTestId("mini-cart");

    // 🔒 Attente stable UI
    await expect(cart).toBeVisible();

    // 🔥 IMPORTANT : attend réellement l'item (fix flakiness)
    await expect(cart.getByTestId("cart-item").first()).toBeVisible({
      timeout: 5000,
    });

    // 👉 Checkout
    await cart.getByTestId("checkout-button").click();

    // 🔒 Tolère légère latence navigation
    await page.waitForURL("**/checkout", { timeout: 10000 });

    await expect(page.locator("h1")).toBeVisible();
  });
});