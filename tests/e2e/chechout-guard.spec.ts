import { test, expect } from "@playwright/test";

test("🚫 Accès checkout avec panier vide", async ({ page }) => {
  await page.goto("/checkout");

  await expect(page.getByText("Votre panier est vide")).toBeVisible();
});