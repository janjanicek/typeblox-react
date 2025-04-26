import { test, expect } from '@playwright/test';
import {
  clickOnToolbarAction,
  getToolbarAction,
  isToolbarActionActive,
  selectTextInBlock,
} from './utils/helpers';

test('Test toggle bold in inline editor', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const secondBlock = page
    .locator('[data-typeblox-editor="block"]')
    .nth(1);

  // — Turn ON bold for “powerful” —
  await selectTextInBlock(secondBlock, 'powerful');
  const boldButton = await clickOnToolbarAction('bold', page);
  await expect(
    secondBlock.locator('b:has-text("powerful")')
  ).toBeVisible();

  // — Turn OFF bold for “powerful” —
  await boldButton.click();
  // helper to confirm it’s no longer active
  expect(await isToolbarActionActive('bold', page)).toBeFalsy();
  await expect(
    secondBlock.locator('b:has-text("powerful")')
  ).toHaveCount(0);

  // — Now select “integrate” and assert bold is still OFF —
  await selectTextInBlock(secondBlock, 'integrate');
  expect(await isToolbarActionActive('bold', page)).toBeFalsy();
});

test('Test toggle italic in block editor', async ({ page }) => {
  await page.goto('http://localhost:3000/topbar');
  const paragraph = page
    .locator('p[data-typeblox-editor="block"]')
    .first();

  // — Turn ON italic for “Typeblox” —
  await selectTextInBlock(paragraph, 'Typeblox');
  const italicButton = await clickOnToolbarAction('italic', page);
  await expect(
    paragraph.locator('i:has-text("Typeblox")')
  ).toBeVisible();

  // — Turn OFF italic for “Typeblox” —
  await italicButton.click();
  expect(await isToolbarActionActive('italic', page)).toBeFalsy();
  await expect(
    paragraph.locator('i:has-text("Typeblox")')
  ).toHaveCount(0);
  // Plain text should still be visible
  await expect(paragraph.locator('text=Typeblox')).toBeVisible();
});

test('Test text color change', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const secondBlock = page
    .locator('[data-typeblox-editor="block"]')
    .nth(1);

  await selectTextInBlock(secondBlock, 'powerful');

  const colorInput = await getToolbarAction('color', page);
  colorInput.click();

  await expect(colorInput).toBeVisible();
  await colorInput.evaluate((el, value) => {
    (el as HTMLInputElement).value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, '#FF0000');

  const powerfulText = secondBlock.locator('text=powerful');
  await expect(powerfulText).toHaveCSS('color', 'rgb(255, 0, 0)');

  await selectTextInBlock(secondBlock, 'integrate');
  const integrateText = secondBlock.locator('text=integrate');
  await expect(integrateText).toHaveCSS('color', 'rgb(0, 0, 0)');
});

test('Test text font change', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const secondBlock = page
    .locator('[data-typeblox-editor="block"]')
    .nth(1);

  await selectTextInBlock(secondBlock, 'powerful');

  const fontInput = await getToolbarAction('font', page);
  fontInput.click();

  const fontsMenu = page
    .locator('.tbx-contextual-menu');


  await expect(fontsMenu).toBeVisible();
  await fontsMenu.locator('a', { hasText: 'courier' }).click();
  await expect(fontsMenu).toBeHidden();

  const powerfulText = secondBlock.locator('text=powerful');
  await expect(powerfulText).toHaveCSS('font-family', 'courier');

  await selectTextInBlock(secondBlock, 'integrate');
  const integrateText = secondBlock.locator('text=integrate');
  await expect(integrateText).not.toHaveCSS('font-family', 'courier');
});
