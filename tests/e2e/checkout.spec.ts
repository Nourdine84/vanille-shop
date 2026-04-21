import { test, expect } from "../setup";
import { openCart, addFirstProduct } from "../utils/cart";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  // 🔒 reset propre (évite pollution entre tests)
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test("Checkout flow stable", async ({ page }) => {
  await page.goto("/products");

  // 🔒 double sécurité loading
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");

  // 🔥 assure que les produits sont visibles
  await expect(page.getByTestId("product-card").first()).toBeVisible();

  // 👉 ajout produit
  await addFirstProduct(page);

  // 👉 ouverture panier
  await openCart(page);

  const cart = page.getByTestId("mini-cart").first();

  await expect(cart).toBeVisible();

  // 🔥 IMPORTANT → attendre que l’item soit bien rendu
  await expect(cart.getByTestId("cart-item").first()).toBeVisible({
    timeout: 5000,
  });

  // 👉 checkout
  await cart.getByTestId("checkout-button").click();

  // 🔥 GESTION RÉELLE PROD (inchangée mais fiabilisée)
  await Promise.race([
    page.waitForURL("**/checkout", { timeout: 12000 }),
    page.waitForURL(/stripe\.com/, { timeout: 12000 }),
  ]);

  const currentUrl = page.url();

  // CAS 1 → Checkout interne
  if (currentUrl.includes("/checkout")) {
    await expect(page.locator("h1")).toBeVisible();
  }

  // CAS 2 → Stripe
  if (currentUrl.includes("stripe.com")) {
    await expect(page).toHaveURL(/stripe\.com/);
  }
});