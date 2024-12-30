import React, { createContext, ReactNode, useContext } from "react";
import { CLASSES } from "../.core/constants";
import { toCssStyle } from "./utils";

interface FormattingContextProps {
  applyFormatting: (tagName: string, style?: Record<string, string>) => void;
  unapplyFormatting: (tagName: string, styleKey?: string | null) => void;
  detectStyle: () => {
    color: string | null;
    backgroundColor: string | null;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikeout: boolean;
    fontFamily: string | null;
  };
  createSelectedElement: (range: Range) => void;
  removeSelectedWrapper: (blockElement: HTMLElement | null) => void;
}

interface FormattingProviderProps {
  blockId: string;
  onUpdate: (blockId: string, content: string) => void;
  children: ReactNode; // Add this line to define children
}

const FormattingContext = createContext<FormattingContextProps | undefined>(
  undefined,
);

export const useFormatting = (): FormattingContextProps => {
  const context = useContext(FormattingContext);
  if (!context) {
    throw new Error("useFormatting must be used within a FormattingProvider");
  }
  return context;
};

export const FormattingProvider: React.FC<FormattingProviderProps> = ({
  blockId,
  children,
  onUpdate,
}) => {
  const contentElement = document.querySelector(
    `[data-typedom-id="${blockId}"]`,
  );

  const createSelectedElement = (): void => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !contentElement) return;

    const range = selection.getRangeAt(0);
    if (!range) return;

    // Create a wrapper element
    const wrapper = document.createElement("span");
    wrapper.className = CLASSES.selected;
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
  };

  const selectAllTextInSelectedElement = (): void => {
    const selectedElement = getSelectedElement();

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

  const removeSelectedWrapper = (blockElement: HTMLElement | null) => {
    if (!blockElement) return;

    const selectedElements = blockElement.querySelectorAll(
      `.${CLASSES.selected}`,
    );
    selectedElements.forEach((element) => {
      const parent = element.parentNode;
      while (element.firstChild) {
        parent?.insertBefore(element.firstChild, element);
      }
      parent?.removeChild(element);
    });
  };

  const detectStyle = () => {
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
      };

      // Traverse up the DOM tree
      while (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
        if (currentNode.matches("p[data-typedom-editor]")) {
          break;
        }

        const computedStyle = window.getComputedStyle(currentNode);
        const currentHTMLElement = currentNode;

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
          detectedStyles.fontFamily = computedStyle.fontFamily || null;
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
    };
  };

  const applyFormatting = (
    tagName: string,
    style: Record<string, string> = {},
  ) => {
    if (!contentElement) return;

    const selectedElement = getSelectedElement(contentElement);

    if (!selectedElement) {
      onUpdate(blockId, contentElement?.innerHTML || "");
      return;
    }

    let matchingParentStyle: HTMLElement | null = null;
    let matchingParentTag: HTMLElement | null =
      selectedElement.closest<HTMLElement>(`${tagName}`);

    if (Object.keys(style).length > 0) {
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
    Object.keys(style).forEach((key: any) => {
      wrapper.style[key] = style[key];
    });

    const parentElement = selectedElement.parentElement;
    if (parentElement) {
      parentElement.replaceChild(wrapper, selectedElement);
      wrapper.appendChild(selectedElement);
    } else {
      selectedElement.replaceWith(wrapper);
      wrapper.appendChild(selectedElement);
    }

    onUpdate(blockId, contentElement?.innerHTML || "");

    selectAllTextInSelectedElement();
  };

  const getSelectedElement = (
    wrapper: Element | Document = document,
  ): HTMLElement | null => {
    return wrapper.querySelector(`.${CLASSES.selected}`);
  };

  const unapplyFormatting = (
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

    if (selectedElement?.innerHTML.trim() === "" && matchingParent) {
      splitContentBySelected();
      selectAllTextInSelectedElement();
      return;
    }

    if (matchingParent && isMatchingSelection) {
      removeMatchingParent(matchingParent);
      onUpdate(blockId, contentElement?.innerHTML || "");
      selectAllTextInSelectedElement();
      return;
    }

    if (styleKey) {
      const closestStyledElement = selectedElement.closest<HTMLElement>(
        `[style*=${styleKey}]`,
      );
      if (closestStyledElement) {
        closestStyledElement.style.removeProperty(styleKey);
        onUpdate(blockId, contentElement?.innerHTML || "");
        selectAllTextInSelectedElement();
      }
    }
  };

  const splitContentBySelected = (): void => {
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

  const removeMatchingParent = (matchingParent: Element) => {
    const parentElement = matchingParent.parentElement;
    while (matchingParent.firstChild) {
      parentElement?.insertBefore(matchingParent.firstChild, matchingParent);
    }
    parentElement?.removeChild(matchingParent);
  };

  return (
    <FormattingContext.Provider
      value={{
        applyFormatting,
        unapplyFormatting,
        createSelectedElement,
        detectStyle,
        removeSelectedWrapper,
      }}
    >
      {children}
    </FormattingContext.Provider>
  );
};
