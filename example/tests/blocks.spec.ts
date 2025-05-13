import { test, expect } from '@playwright/test';
import { getToolbarAction, selectTextInBlock } from "./utils/helpers";

test('Toolbar to contain the right type', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const inlineToolbar = page.locator('.tbx-toolbar.tbx-toolbar-inline');
  const blocks = page.locator('[data-typeblox-editor="block"]');

  const firstBlock = blocks.first();
  await selectTextInBlock(firstBlock, 'Typeblox');
  await expect(inlineToolbar).toBeVisible();
  await expect(await getToolbarAction('type', page)).toContainText('Headline 1');

  const secondBlock = blocks.nth(1);
  await selectTextInBlock(secondBlock, 'Typeblox');
  await expect(inlineToolbar).toBeVisible();
  await expect(await getToolbarAction('type', page)).toContainText('Text');

  const thirdBlock = blocks.nth(3);
  await selectTextInBlock(thirdBlock, 'bold');
  await expect(inlineToolbar).toBeVisible();
  await expect(await getToolbarAction('type', page)).toContainText('Bulleted list');
});

test('Add a new block and type into it', async ({ page }) => {
  await page.goto('http://localhost:3000/#/topbar');

  const toolbar = page.locator('.tbx-toolbar.tbx-toolbar-block');
  await expect(toolbar).toBeVisible();

  const blocks = page.locator('[data-typeblox-editor="block"]');
  await expect(blocks.nth(1)).toHaveText(/Typeblox is a powerful and flexible/);

  await page.locator('[data-test="add"]').click();
  const contextualMenu = page.locator('.tbx-contextual-menu');
  await expect(contextualMenu).toBeVisible();
  await expect(contextualMenu).toContainText('Add new block');
  await contextualMenu.locator('a').nth(1).click();
  await expect(contextualMenu).toBeHidden();

  const updatedBlocks = page.locator('[data-typeblox-editor="block"]');
  const newBlock = updatedBlocks.nth(1);
  await expect(newBlock).toBeEmpty();

  await newBlock.click();
  await newBlock.type('My awesome newly-added block!');

  await expect(newBlock).toHaveText('My awesome newly-added block!');
});

test('Remove block', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.addStyleTag({
    content: `
    #typeblox-editor .tbx-block:first-of-type .tbx-actions {
        opacity: 1 !important;
        visibility: visible !important;
      }`
  });

  const blocks = page.locator('.tbx-block');
  await expect(blocks).toHaveCount(18);

  const firstBlock = blocks.first();

  const dragButon = firstBlock.locator('[data-test="drag"]');
  await expect(dragButon).toBeVisible();
  await dragButon.click();
  const contextualMenu = page.locator('.tbx-contextual-menu');
  await expect(contextualMenu).toBeVisible();
  await contextualMenu.locator('a').nth(2).click();
  await expect(contextualMenu).toBeHidden();
  await expect(blocks).toHaveCount(17);
  await expect(blocks.first()).toHaveText(/Typeblox is a powerful and flexible/);
});

test('Move down the first block, then move up the 3rd block', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.addStyleTag({
    content: `
      #typeblox-editor .tbx-block:first-of-type .tbx-actions,
      #typeblox-editor .tbx-block:nth-of-type(3) .tbx-actions {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
    `
  });

  const blocks = page.locator('.tbx-block');
  await expect(blocks).toHaveCount(18);

  const originalFirstText = await blocks.first().textContent();
  const firstDrag = blocks.first().locator('[data-test="drag"]');
  await expect(firstDrag).toBeVisible();
  await firstDrag.click();

  const menu = page.locator('.tbx-contextual-menu');
  await expect(menu).toBeVisible();
  await menu.locator('a').filter({ hasText: /move down/i }).click();
  await expect(menu).toBeHidden();

  await expect(blocks).toHaveCount(18);
  await expect(blocks.nth(1)).toHaveText(originalFirstText || '');

  const originalThirdText = await blocks.nth(2).textContent();
  const thirdDrag = blocks.nth(2).locator('[data-test="drag"]');
  await expect(thirdDrag).toBeVisible();
  await thirdDrag.click();
  await expect(menu).toBeVisible();
  await menu.locator('a').filter({ hasText: /move up/i }).click();
  await expect(menu).toBeHidden();

  await expect(blocks).toHaveCount(18);
  await expect(blocks.nth(1)).toHaveText(originalThirdText || '');
});


