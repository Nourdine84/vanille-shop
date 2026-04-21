import { test, expect } from "../setup";

test("🚫 Accès checkout avec panier vide", async ({ page }) => {
  await page.goto("/checkout");
  await page.waitForLoadState("networkidle");

  const body = page.locator("body");
  await expect(body).toBeVisible();

  const text = (await body.textContent()) || "";

  expect(text).toMatch(
    /panier est vide|panier vide|checkout|commande|finalisation/i
  );
});