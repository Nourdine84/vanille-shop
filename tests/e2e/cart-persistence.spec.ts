import { test, expect } from "@playwright/test";
import { openCart } from "../utils/cart";

test("🧠 Persistance panier entre pages", async ({ page }) => {
  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  await page.getByTestId("cart-button").click();

  await page.getByRole("button", { name: "+" }).first().click();

  await expect(page.getByTestId("item-quantity")).toHaveText("2");

  await page.getByTestId("checkout-button").click();

  await expect(page.getByText("Quantité : 2")).toBeVisible();
});