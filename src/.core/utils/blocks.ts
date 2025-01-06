export const focusBlock = (blockId: string, fucusOnEnd: boolean = false) => {
  const newBlockElement = document.querySelector(
    `[data-typeblox-id="${blockId}"]`,
  );
  if (newBlockElement) {
    (newBlockElement as HTMLElement).focus();

    if (fucusOnEnd) {
      const selection = window.getSelection();
      const range = document.createRange();

      range.selectNodeContents(newBlockElement); // Select the entire contents
      range.collapse(false); // Collapse the range to the end
      selection?.removeAllRanges(); // Clear existing selections
      selection?.addRange(range); // Add the new range
    }
  }
};

export const getBlockElementById = (blockId: string): HTMLElement | null => {
  return document.querySelector(`[data-typeblox-id="${blockId}"]`);
};

export const getBlockElement = (): HTMLElement | null => {
  const selection = window.getSelection();

  // Check if there's a valid selection and at least one range
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const selectedNode = range.startContainer;

  // Check if the selectedNode is an Element and use `closest`, or fall back to parentNode
  if (selectedNode instanceof Element) {
    return selectedNode.closest("[data-typeblox-id]");
  } else if (selectedNode.parentNode instanceof Element) {
    return selectedNode.parentNode.closest("[data-typeblox-id]");
  }

  return null;
};
