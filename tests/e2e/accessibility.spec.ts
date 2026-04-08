import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("♿ Accessibilité", () => {
  test("Homepage sans violation critique", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test("Products sans violation critique", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test("Checkout sans violation critique", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
});