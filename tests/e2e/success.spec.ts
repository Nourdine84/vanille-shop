import { test, expect } from "@playwright/test";

test("✅ Page succès paiement", async ({ page }) => {
  await page.goto("/success");

  await expect(page.getByText(/merci/i)).toBeVisible();
});
