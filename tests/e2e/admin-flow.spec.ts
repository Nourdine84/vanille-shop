import { test, expect } from "../setup";
import { loginAsAdmin } from "../utils/admin";

test("Flow admin complet", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/admin/products");
  await page.waitForLoadState("networkidle");

  await expect(page.locator("body")).toBeVisible();

  const productsBody = (await page.locator("body").textContent()) || "";
  expect(productsBody).toMatch(/Produits|Produit|Admin/i);

  await page.goto("/admin/orders");
  await page.waitForLoadState("networkidle");

  await expect(page.locator("body")).toBeVisible();

  const ordersBody = (await page.locator("body").textContent()) || "";
  expect(ordersBody).toMatch(/Commandes|commande|Orders|order/i);
});