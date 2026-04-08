import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // 🔥 TON DOSSIER CORRECT

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3001', // 🔥 IMPORTANT
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'iphone-13',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'pixel-7',
      use: { ...devices['Pixel 7'] },
    }
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
  },
});