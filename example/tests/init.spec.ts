import { test, expect } from '@playwright/test';

test('Loads different types of editor', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/React App/);
  const editor = page.locator('#typeblox-editor');
  await expect(editor).toHaveCount(1);
  await expect(editor).toBeVisible();
  await page.goto('http://localhost:3000/topbar');
  const editor2 = page.locator('#typeblox-editor');
  await expect(editor2).toHaveCount(1);
  await expect(editor2).toBeVisible();
});
