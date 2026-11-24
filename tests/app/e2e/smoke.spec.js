// Smoke test: the app loads at its production path (/setlist/app/) and its
// JavaScript modules run (served with the right content types).

import { test, expect } from '@playwright/test';

test('the app opens and shows Setlist', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('./');

  await expect(page).toHaveTitle('Setlist');
  await expect(page.getByRole('heading', { name: 'Setlist' })).toBeVisible();
  expect(errors).toEqual([]);
});

// Rule (app-shell.md, Start and address): the website root leads to the app.
test('the website root opens the app', async ({ page }) => {
  await page.goto('/setlist/');

  await expect(page).toHaveURL(/\/setlist\/app\/$/);
  await expect(page.getByRole('heading', { name: 'Setlist' })).toBeVisible();
});
