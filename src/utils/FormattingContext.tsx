import React, { createContext, ReactNode, useContext, useRef } from "react";
import { toCssStyle } from "./utils";

interface FormattingContextProps {
  applyFormatting: (tagName: string, style?: Record<string, string>) => void;
  unapplyFormatting: (tagName: string, styleKey?: string | null) => void;
  saveSelection: () => void;
  detectStyle: () => {
    color: string | null;
    backgroundColor: string | null;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikeout: boolean;
    fontFamily: string | null;
  };
  restoreSelection: () => void;
  createSelectedElement: (range: Range) => void;
}

interface FormattingProviderProps {
  blockId: string;
  onUpdate: (blockId: string, content: string) => void;
  createSelectedElement: (range: Range) => void;
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
  const savedSelection = useRef<Range | null>(null);

  const contentElement = document.querySelector(
    `[data-typedom-id="${blockId}"]`,
  );

  const createSelectedElement = (range: Range) => {
    const wrapper = document.createElement("span");
    wrapper.className = "selected";
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
  };

  const selectAllTextInSelectedElement = (): void => {
    // Get the `.selected` element
    const selectedElement = document.querySelector(".selected") as HTMLElement;

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

  const saveSelection = () => {
    const selection = window.getSelection();
    console.warn(selection);
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    if (savedSelection.current) {
      selection?.addRange(savedSelection.current);
    }
  };

  const detectStyle = () => {
    // const selection = window.getSelection();
    const selection = document.querySelector(".selected");
    if (selection) {
      // const range = selection.getRangeAt(0);
      let currentNode = selection as Element;

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

        const computedStyle = window.getComputedStyle(currentNode as Element);

        // Detect color
        if (!detectedStyles.color) {
          detectedStyles.color = computedStyle.color || null;
        }

        // Detect background color
        if (!detectedStyles.backgroundColor) {
          detectedStyles.backgroundColor =
            computedStyle.backgroundColor || null;
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
    console.log("applyFormatting", tagName, style);

    if (!contentElement) return;
    const selectedElement = document.querySelector(".selected");

    if (!selectedElement) {
      // contentElement?.normalize();
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

      if (matchingParentStyle) {
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

  const unapplyFormatting = (
    tagName: string,
    styleKey: string | null = null,
  ) => {
    restoreSelection();

    console.log("unapplyFormatting", tagName);

    const selectedElement = document.querySelector(".selected");
    if (!selectedElement) return;

    const matchingParent = selectedElement.closest(tagName);
    if (matchingParent) {
      const parentElement = matchingParent.parentElement;
      while (matchingParent.firstChild) {
        parentElement?.insertBefore(matchingParent.firstChild, matchingParent);
      }
      parentElement?.removeChild(matchingParent);
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
        contentElement?.normalize();
        onUpdate(blockId, contentElement?.innerHTML || "");
        selectAllTextInSelectedElement();
      }
    }
  };

  return (
    <FormattingContext.Provider
      value={{
        applyFormatting,
        unapplyFormatting,
        saveSelection,
        restoreSelection,
        createSelectedElement,
        detectStyle,
      }}
    >
      {children}
    </FormattingContext.Provider>
  );
};
