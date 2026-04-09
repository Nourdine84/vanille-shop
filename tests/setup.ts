import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    // 🔥 reset état AVANT CHAQUE TEST
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await use(page);
  },
});

export { expect } from "@playwright/test";