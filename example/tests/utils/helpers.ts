import { expect, Locator, type Page } from '@playwright/test';

export async function clickOnToolbarAction(
  action: string,
  page: Page
): Promise<Locator> {
  await expect(page.locator('.tbx-toolbar')).toBeVisible();
  const button = getToolbarAction(action, page);
  await (await button).click();
  await expect(page.locator(`[data-test="${action}"].tbx-active`)).toBeVisible();
  return button;
}

export async function getToolbarAction(
  action: string,
  page: Page
): Promise<Locator> {
  const toolbarAction = page.locator(`[data-test="${action}"]`);
  return toolbarAction;
}

export async function isToolbarActionActive(
  action: string,
  page: Page
): Promise<boolean> {
  const btn = page.locator(`[data-test="${action}"]`);
  const classList = await btn.evaluate(el => el.className);
  return classList.split(/\s+/).includes('tbx-active');
}

export async function selectTextInBlock(block: Locator, targetText: string) {
  await block.evaluate((el, text) => {
    console.warn('selectTextInBlock', el, text);
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let node: Node | null = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const txt = (node as Text).textContent || '';
        const idx = txt.indexOf(text);
        if (idx >= 0) {
          const range = document.createRange();
          range.setStart(node, idx);
          range.setEnd(node, idx + text.length);
          const sel = window.getSelection();
          if (!sel) throw new Error('No Selection API available');
          sel.removeAllRanges();
          sel.addRange(range);
          // let your editor respond
          document.dispatchEvent(new Event('selectionchange'));
          return;
        }
      }
      node = walker.nextNode();
    }
    throw new Error(`Text "${text}" not found in block`);
  }, targetText);
}
