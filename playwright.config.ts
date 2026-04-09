import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e", // ✅ FIX CRITIQUE

  fullyParallel: true,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // 🔥 plus safe
  workers: process.env.CI ? 1 : 2, // 🔥 stabilité locale

  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],

  use: {
    baseURL: "http://localhost:3000", // ✅ FIX PORT UNIQUE

    headless: true,

    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",

    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],

  webServer: {
    command: "npm run dev",

    port: 3000, // ✅ IMPORTANT → PAS url

    reuseExistingServer: !process.env.CI,

    timeout: 120000,
  },
});