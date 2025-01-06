import { CLASSES } from "../constants";

export class TypingManager {
  private lastRange: Range | null = null;

  public saveSelectionRange() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null; // No selection or cursor
    }

    const range = selection.getRangeAt(0); // Get the current selection range
    this.lastRange = range;
  }

  public restoreSelectionRange() {
    if (!this.lastRange) {
      return; // Nothing to restore
    }

    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    // Clear any existing selection
    selection.removeAllRanges();

    // Create a new range
    const range = document.createRange();
    range.setStart(this.lastRange.startContainer, this.lastRange.startOffset);
    range.setEnd(this.lastRange.endContainer, this.lastRange.endOffset);

    // Add the range back to the selection
    selection.addRange(range);
  }

  createSelectedElement(range?: Range): void {
    let customRange = range;
    if (customRange) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      customRange = selection.getRangeAt(0);
    }
    if (!customRange) return;

    const wrapper = document.createElement("span");
    wrapper.className = CLASSES.selected;
    wrapper.appendChild(customRange.extractContents());
    customRange.insertNode(wrapper);
  }

  getSelectedElement(
    wrapper: Element | Document = document,
  ): HTMLElement | null {
    const selectionElement = wrapper.querySelector(
      `.${CLASSES.selected}`,
    ) as HTMLElement;
    return selectionElement;
  }

  getCursorElement() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    return container.nodeType === Node.TEXT_NODE
      ? container.parentElement
      : container;
  }

  splitContentBySelected(): void {
    const selected = this.getSelectedElement();

    if (!selected) {
      console.error("No element with class 'selected' found");
      return;
    }
    const parent = selected.parentElement;

    if (!parent) {
      console.error("Selected element has no parent");
      return;
    }

    // Create fragments for "before" and "after" content
    const beforeFragment = document.createDocumentFragment();
    const afterFragment = document.createDocumentFragment();

    // Move siblings before the selected element to the beforeFragment
    while (selected.previousSibling) {
      beforeFragment.insertBefore(
        selected.previousSibling,
        beforeFragment.firstChild,
      );
    }

    // Move siblings after the selected element to the afterFragment
    while (selected.nextSibling) {
      afterFragment.appendChild(selected.nextSibling);
    }

    // Split the parent element by inserting the fragments
    const parentCloneBefore = parent.cloneNode(false) as HTMLElement;
    const parentCloneAfter = parent.cloneNode(false) as HTMLElement;

    parentCloneBefore.appendChild(beforeFragment);
    parentCloneAfter.appendChild(afterFragment);

    // Insert the "before" and "after" content into the DOM
    parent.parentNode?.insertBefore(parentCloneBefore, parent);
    parent.parentNode?.insertBefore(selected, parent);
    parent.parentNode?.insertBefore(parentCloneAfter, parent);

    // Remove the original parent
    parent.remove();
  }

  selectAllTextInSelectedElement(): void {
    let selectedElement = this.getSelectedElement();
    if (!selectedElement) {
      this.createSelectedElement();
      selectedElement = this.getSelectedElement();
    }

    if (!selectedElement) {
      console.warn("No .selected element found.");
      return;
    }

    // Create a new range
    const range = document.createRange();

    try {
      // Set the range to start at the beginning and end at the last character of the `.selected` element
      range.selectNodeContents(selectedElement);

      // Clear any existing selections
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch (error) {
      console.error("Error selecting text:", error);
    }
  }

  removeSelection(blockElement: HTMLElement | null) {
    if (!blockElement) return;

    const selectedElements = blockElement.querySelectorAll(
      `.${CLASSES.selected}`,
    );
    selectedElements.forEach((element) => {
      if (element.innerHTML.trim() === "") {
        // remove empty selected element
        element.remove();
        return;
      }
      const parent = element.parentNode;
      while (element.firstChild) {
        parent?.insertBefore(element.firstChild, element);
      }
      parent?.removeChild(element);
    });
  }
}
