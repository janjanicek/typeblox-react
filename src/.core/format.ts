import { AVAILABLE_FONTS, CLASSES } from "./constants";
import { detectedStyles } from "./types";
import { toCssStyle } from "./utils";

export const createSelectedElement = (range?: Range): void => {
  let customRange = range;
  if (customRange) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    customRange = selection.getRangeAt(0);
  }
  if (!customRange) return;

  // Create a wrapper element
  const wrapper = document.createElement("span");
  wrapper.className = CLASSES.selected;
  wrapper.appendChild(customRange.extractContents());
  customRange.insertNode(wrapper);
};

const getSelectedElement = (
  wrapper: Element | Document = document,
): HTMLElement | null => {
  const selectionElement = wrapper.querySelector(
    `.${CLASSES.selected}`,
  ) as HTMLElement;
  return selectionElement;
};

const getBlockElement = (): HTMLElement | null => {
  const selection = window.getSelection();

  // Check if there's a valid selection and at least one range
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const selectedNode = range.startContainer;

  // Check if the selectedNode is an Element and use `closest`, or fall back to parentNode
  if (selectedNode instanceof Element) {
    return selectedNode.closest("[data-typeblox-id]");
  } else if (selectedNode.parentNode instanceof Element) {
    return selectedNode.parentNode.closest("[data-typeblox-id]") as HTMLElement;
  }

  return null;
};

export const applyFormat = (
  tagName: string,
  style?: Record<string, string>,
) => {
  const contentElement = getBlockElement();
  if (!contentElement) return;

  const selectedElement = getSelectedElement(contentElement);

  if (!selectedElement || selectedElement.textContent?.trim() === "") {
    return;
  }

  let matchingParentStyle: HTMLElement | null = null;
  let matchingParentTag: HTMLElement | null =
    selectedElement.closest<HTMLElement>(`${tagName}`);

  if (style && Object.keys(style).length > 0) {
    const leadingStyle = Object.keys(style)[0];
    const styleKey = toCssStyle(leadingStyle);
    matchingParentStyle = selectedElement.closest<HTMLElement>(
      `${tagName}[style*=${styleKey}]`,
    );

    if (
      matchingParentStyle &&
      matchingParentStyle.textContent?.trim() ===
        selectedElement?.textContent?.trim()
    ) {
      Object.keys(style).forEach((key) => {
        (matchingParentStyle as HTMLElement).style[key as any] = style[key];
      });
      return;
    }
  } else if (matchingParentTag) {
    return;
  }

  const wrapper = document.createElement(tagName);
  if (style) {
    Object.keys(style).forEach((key: any) => {
      wrapper.style[key] = style[key];
    });
  }

  const parentElement = selectedElement.parentElement;
  if (parentElement) {
    parentElement.replaceChild(wrapper, selectedElement);
    wrapper.appendChild(selectedElement);
  } else {
    selectedElement.replaceWith(wrapper);
    wrapper.appendChild(selectedElement);
  }
};

export const unapplyFormat = (
  tagName: string,
  styleKey: string | null = null,
) => {
  const selectedElement = getSelectedElement(document);
  if (!selectedElement) {
    return;
  }

  const matchingParent = selectedElement.closest(tagName);
  const isMatchingSelection =
    selectedElement.textContent === matchingParent?.textContent;
  const matchingChildren = selectedElement.querySelectorAll(tagName);

  if (matchingChildren.length > 0) {
    Array.from(matchingChildren).forEach((element) => {
      removeElement(element);
    });
  }

  if (selectedElement?.innerHTML.trim() === "" && matchingParent) {
    splitContentBySelected();
    selectAllTextInSelectedElement();
    return;
  }

  if (matchingParent && isMatchingSelection) {
    removeElement(matchingParent);
    selectAllTextInSelectedElement();
  }

  if (styleKey) {
    const closestStyledElement = selectedElement.closest<HTMLElement>(
      `[style*=${styleKey}]`,
    );
    if (closestStyledElement) {
      closestStyledElement.style.removeProperty(styleKey);
    }
  }

  unapplyAliases(tagName);
};

const unapplyAliases = (tagName: string) => {
  if (tagName === "strong") {
    unapplyFormat("b");
    unapplyFormat("bold");
  }
  if (tagName === "i") {
    unapplyFormat("em");
  }
};

export const getStyle = (): detectedStyles => {
  const selection = getSelectedElement();
  if (selection) {
    let currentNode = selection.parentElement as HTMLElement;

    // Default styles
    const detectedStyles = {
      color: null as string | null,
      backgroundColor: null as string | null,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrikeout: false,
      fontFamily: null as string | null,
      isH1: false,
      isH2: false,
      isH3: false,
      isParagraph: false,
      isCode: false,
    };

    // Traverse up the DOM tree
    while (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
      if (currentNode.matches("p[data-typeblox-editor]")) {
        break;
      }

      const computedStyle = window.getComputedStyle(currentNode);
      const currentHTMLElement = currentNode;
      const blockType = currentNode.closest("[data-typeblox-id]")?.nodeName;

      if (blockType && blockType === "H1") {
        detectedStyles.isH1 = true;
      }
      if (blockType && blockType === "H2") {
        detectedStyles.isH2 = true;
      }
      if (blockType && blockType === "H3") {
        detectedStyles.isH2 = true;
      }
      if (blockType && blockType === "P") {
        detectedStyles.isParagraph = true;
      }
      if (blockType && blockType === "CODE") {
        detectedStyles.isCode = true;
      }

      // Detect color
      if (!detectedStyles.color) {
        detectedStyles.color = computedStyle.color || null;
      }

      // Detect background color
      if (
        !detectedStyles.backgroundColor &&
        currentHTMLElement.style?.backgroundColor
      ) {
        detectedStyles.backgroundColor =
          currentHTMLElement.style.backgroundColor;
      }

      // Detect font-family
      if (!detectedStyles.fontFamily) {
        const cleanFont = computedStyle.fontFamily.replace(/^"|"$/g, "");
        if (
          cleanFont &&
          AVAILABLE_FONTS.map((f) => f.toLowerCase()).includes(
            cleanFont.toLowerCase(),
          )
        ) {
          detectedStyles.fontFamily = cleanFont;
        } else {
          detectedStyles.fontFamily = "Arial";
        }
      }

      // Detect bold (font-weight >= 700)
      if (
        !detectedStyles.isBold &&
        computedStyle.fontWeight.toString() >= "700"
      ) {
        detectedStyles.isBold = true;
      }

      // Detect italic
      if (!detectedStyles.isItalic && computedStyle.fontStyle === "italic") {
        detectedStyles.isItalic = true;
      }

      // Detect underline
      if (
        !detectedStyles.isUnderline &&
        computedStyle.textDecoration.includes("underline")
      ) {
        detectedStyles.isUnderline = true;
      }

      // Detect strikeout
      if (
        !detectedStyles.isStrikeout &&
        computedStyle.textDecoration.includes("line-through")
      ) {
        detectedStyles.isStrikeout = true;
      }

      // Move up to the parent node
      currentNode = currentNode.parentElement!;
    }

    return detectedStyles;
  }

  // Return default styles if no selection is found
  return {
    color: null,
    backgroundColor: null,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikeout: false,
    fontFamily: null,
    isH1: false,
    isH2: false,
    isH3: false,
    isParagraph: false,
    isCode: false,
  };
};

export const splitContentBySelected = (): void => {
  const selected = getSelectedElement();

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
};

export const removeElement = (matchingParent: Element) => {
  const parentElement = matchingParent.parentElement;
  while (matchingParent.firstChild) {
    parentElement?.insertBefore(matchingParent.firstChild, matchingParent);
  }
  parentElement?.removeChild(matchingParent);
};

export const selectAllTextInSelectedElement = (): void => {
  let selectedElement = getSelectedElement();
  if (!selectedElement) {
    createSelectedElement();
    selectedElement = getSelectedElement();
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
};

export const removeSelection = (blockElement: HTMLElement | null) => {
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
};
