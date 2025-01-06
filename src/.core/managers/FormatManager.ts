import type { TypingManager } from ".core/managers/TypingManager";
import { AVAILABLE_FONTS } from "../constants";
import { detectedStyles } from "../types";
import { getBlockElement } from "../utils/blocks";
import { toCssStyle } from "../utils/css";
import { removeElement } from "../utils/dom";

export class FormatManager {
  private TypingManager: TypingManager;

  constructor(TypingManager: TypingManager) {
    this.TypingManager = TypingManager;
  }

  public applyFormat(tagName: string, style?: Record<string, string>) {
    const contentElement = getBlockElement();
    if (!contentElement) return;

    const selectedElement =
      this.TypingManager.getSelectedElement(contentElement);

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
  }

  public unapplyFormat(tagName: string, styleKey: string | null = null) {
    const selectedElement = this.TypingManager.getSelectedElement(document);
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
      this.TypingManager.splitContentBySelected();
      this.TypingManager.selectAllTextInSelectedElement();
      return;
    }

    if (matchingParent && isMatchingSelection) {
      removeElement(matchingParent);
      this.TypingManager.selectAllTextInSelectedElement();
    }

    if (styleKey) {
      const closestStyledElement = selectedElement.closest<HTMLElement>(
        `[style*=${styleKey}]`,
      );
      if (closestStyledElement) {
        closestStyledElement.style.removeProperty(styleKey);
      }
    }

    this.unapplyAliases(tagName);
  }

  unapplyAliases(tagName: string) {
    if (tagName === "strong") {
      this.unapplyFormat("b");
      this.unapplyFormat("bold");
    }
    if (tagName === "i") {
      this.unapplyFormat("em");
    }
  }

  getStyle = (): detectedStyles => {
    const selection = this.TypingManager.getSelectedElement();
    let currentNode = (
      selection
        ? selection.parentElement
        : this.TypingManager.getCursorElement()
    ) as HTMLElement;
    if (currentNode) {
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
}
