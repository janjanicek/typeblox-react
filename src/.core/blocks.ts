export const focusBlock = (blockId: string, fucusOnEnd: boolean = false) => {
  const newBlockElement = document.querySelector(
    `[data-typedom-id="${blockId}"]`,
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
