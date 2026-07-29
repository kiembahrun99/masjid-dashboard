import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './scripts',
  timeout: 120000,
  use: { baseURL: 'http://localhost:3000', headless: true },
  webServer: {
    command: 'npx next dev -p 3000',
    port: 3000,
    timeout: 180000,
    reuseExistingServer: true,
  },
});
