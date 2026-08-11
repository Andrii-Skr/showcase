import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 2,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:3400",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm start:e2e",
    url: "http://127.0.0.1:3400/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-360", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
