import { test, expect } from "@playwright/test";

test("💳 Mock paiement Stripe", async ({ page }) => {

  // 🔥 INTERCEPT API STRIPE
  await page.route("**/api/create-checkout-session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: "/success", // fake redirect
      }),
    });
  });

  await page.goto("/products");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  // fermer overlay
  await page.getByTestId("cart-overlay").click();

  await page.getByTestId("cart-button").click();

  await page.getByTestId("checkout-button").click();

  // Vérifier redirection simulée
  await expect(page).toHaveURL("/success");
});