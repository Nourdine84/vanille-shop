import { test, expect } from "../setup";
import { openCart } from "../utils/cart";

test("💳 Mock paiement Stripe", async ({ page }) => {

  await page.route("**/api/create-checkout-session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: "/checkout/success?mock=1",
      }),
    });
  });

  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  const btn = page.getByRole("button", { name: /Ajouter/i }).first();

  await btn.click();
  await page.waitForTimeout(200);

  await openCart(page);

  const checkoutBtn = page.getByTestId("checkout-button");

  await expect(checkoutBtn).toBeVisible();

  await checkoutBtn.click();

  // 🔥 FIX → attendre navigation réelle
  await page.waitForURL(/checkout\/success/, { timeout: 10000 });

  await expect(page).toHaveURL(/checkout\/success/);
});