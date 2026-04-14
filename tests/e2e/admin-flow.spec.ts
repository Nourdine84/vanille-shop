import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../utils/admin";

test("Flow admin complet", async ({ page }) => {
  await loginAsAdmin(page);

  // PRODUCTS
  await page.goto("/admin/products");
  await expect(page.getByText("Admin Produits")).toBeVisible();

  // ORDERS
  await page.goto("/admin/orders");
  await expect(page.getByText("Commandes")).toBeVisible();
});