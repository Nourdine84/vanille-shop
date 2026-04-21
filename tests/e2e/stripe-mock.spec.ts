import { test, expect } from "../setup";
import { openCart } from "../utils/cart";

test("💳 Mock paiement Stripe", async ({ page }) => {
  await page.route("**/api/create-checkout-session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: "http://localhost:3000/checkout/success?mock=1",
      }),
    });
  });

  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: /Ajouter/i }).first().click();

  await openCart(page);

  await page.getByTestId("checkout-button").click();

  await page.waitForURL("**/checkout/success**", { timeout: 10000 });
  await expect(page).toHaveURL(/checkout\/success/);
});