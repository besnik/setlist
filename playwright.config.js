// Playwright configuration for the app's end-to-end tests (tests/app/e2e).
// Starts the dev server on its own port; Chromium runs everywhere, WebKit only in
// CI because the agent environment has no WebKit (ADR 0005).

import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: 'tests/app/e2e',
  reporter: process.env.CI ? [['dot'], ['github']] : 'dot',
  forbidOnly: Boolean(process.env.CI),
  use: {
    baseURL: `http://localhost:${PORT}/setlist/app/`,
    trace: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ...(process.env.CI ? [{ name: 'webkit', use: { ...devices['iPhone 13'] } }] : []),
  ],
  webServer: {
    command: 'node tools/serve.js',
    env: { PORT: String(PORT) },
    url: `http://localhost:${PORT}/setlist/app/`,
    reuseExistingServer: !process.env.CI,
  },
});
