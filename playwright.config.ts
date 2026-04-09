import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:3001",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    // 🖥 Desktop stable
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    // 📱 Mobile Android (SAFE)
    {
      name: "pixel-7",
      use: {
        ...devices["Pixel 7"],
      },
    },

    // ❌ WEBKIT / IPHONE DÉSACTIVÉ (mac13 incompatible)
    // On le réactivera en CI plus tard
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});