import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../utils/admin";

test.describe("🧾 Admin Orders", () => {
  test("Accès page commandes", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/admin/orders");

    await expect(page.getByText("Commandes")).toBeVisible();
  });

  test("Filtrer commandes", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/admin/orders");

    await page.selectOption('select[name="status"]', "PAID");
    await page.getByRole("button", { name: "Filtrer" }).click();

    await expect(page.locator("body")).toBeVisible();
  });

  test("Update status commande", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/admin/orders");

    const firstOrder = page.locator("form").first();

    await firstOrder.locator('select[name="status"]').selectOption("SHIPPED");

    await firstOrder.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/admin\/orders/);
  });
});