import { test, expect } from "../setup";

test("✅ Page succès paiement", async ({ page }) => {
  await page.goto("/checkout/success");
  await page.waitForLoadState("networkidle");

  const body = page.locator("body");
  await expect(body).toBeVisible();

  const text = (await body.textContent()) || "";
  expect(text).toMatch(/commande|merci|succès|validée|confirmation/i);
});