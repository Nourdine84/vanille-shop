import { test, expect } from "@playwright/test";

test("💰 Calcul du total panier dynamique", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  await page.getByTestId("cart-button").click();

  const totalBefore = await page.getByTestId("cart-total").innerText();

  await page.getByRole("button", { name: "+" }).first().click();

  await expect(page.getByTestId("cart-total")).not.toHaveText(totalBefore);
});