import { test, expect } from "@playwright/test";

test("💰 Calcul du total panier dynamique", async ({ page }) => {
  await page.goto("/products");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  // 🔥 FIX overlay
  const overlay = page.locator('[data-testid="cart-overlay"]');
  if (await overlay.isVisible().catch(() => false)) {
    await overlay.click();
  }

  await page.getByTestId("cart-button").click();

  const totalBefore = await page.getByTestId("cart-total").innerText();

  const plusBtn = page.getByRole("button", { name: "+" }).first();
  await plusBtn.click();

  const totalAfter = await page.getByTestId("cart-total").innerText();

  expect(totalBefore).not.toBe(totalAfter);
});