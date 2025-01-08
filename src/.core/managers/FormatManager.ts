import type { TypingManager } from ".core/managers/TypingManager";
import { AVAILABLE_FONTS, CLASSES } from "../constants";
import { detectedStyles } from "../types";
import { toCssStyle } from "../utils/css";
import { DOMManager } from "./DOMManager";

export class FormatManager {
  private TypingManager: TypingManager;

  private DOMManager: DOMManager;

  constructor(TypingManager: TypingManager, DOMManager: DOMManager) {
    this.TypingManager = TypingManager;
    this.DOMManager = DOMManager;
  }

  public applyFormat(tagName: string, style?: Record<string, string>) {
    const contentElement = this.DOMManager.getBlockElement();
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
      selectedElement.textContent?.trim() ===
      matchingParent?.textContent?.trim();
    const matchingChildren = selectedElement.querySelectorAll(tagName);

    if (matchingChildren.length > 0) {
      Array.from(matchingChildren).forEach((element) => {
        this.DOMManager.removeElement(element);
      });
    }

    if (matchingParent && isMatchingSelection) {
      this.DOMManager.removeElement(matchingParent);
      this.TypingManager.selectAllTextInSelectedElement();
    }

    if (styleKey) {
      const closestStyledElement = selectedElement.closest<HTMLElement>(
        `${tagName}`,
      );
      if (closestStyledElement && closestStyledElement.style[styleKey as any]) {
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
      selection ? selection : this.TypingManager.getCursorElement()
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

      const detectStylesOnNode = (node: HTMLElement) => {
        const computedStyle = window.getComputedStyle(node);
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

        if (
          !detectedStyles.isBold &&
          (computedStyle.fontWeight.toString() >= "700" || node.matches("b"))
        ) {
          detectedStyles.isBold = true;
        }

        if (
          !detectedStyles.isItalic &&
          (computedStyle.fontStyle === "italic" || node.matches("i"))
        ) {
          detectedStyles.isItalic = true;
        }

        if (
          !detectedStyles.isUnderline &&
          (computedStyle.textDecoration.includes("underline") ||
            node.matches("u"))
        ) {
          detectedStyles.isUnderline = true;
        }

        if (
          !detectedStyles.isStrikeout &&
          (computedStyle.textDecoration.includes("line-through") ||
            node.matches("s"))
        ) {
          detectedStyles.isStrikeout = true;
        }

        // Detect color
        if (!detectedStyles.color) {
          detectedStyles.color = computedStyle.color || null;
        }

        // Detect background color
        if (!detectedStyles.backgroundColor && node.style?.backgroundColor) {
          detectedStyles.backgroundColor = node.style.backgroundColor;
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
      };

      if (
        currentNode.childNodes.length === 1 &&
        currentNode.firstChild?.nodeType === Node.ELEMENT_NODE
      ) {
        const firstChild = currentNode.firstChild as HTMLElement;
        if (firstChild.matches("b, i, s, u")) {
          detectStylesOnNode(firstChild);
        }
      }

      // Traverse up the DOM tree
      while (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
        if (currentNode.matches("p[data-typeblox-editor]")) {
          break;
        }

        // Detect styles on the current node
        detectStylesOnNode(currentNode);

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
  clearFormat = (element?: HTMLElement) => {
    const selection = this.TypingManager.getSelectedElement();
    const cursorElement = this.TypingManager.getCursorElement();

    // Determine the current node to operate on
    let targetElement = element || selection || cursorElement;

    if (!targetElement) {
      console.warn(
        "No selected or cursor element found for clearing formatting.",
      );
      return;
    }

    const removeFormatting = (element: HTMLElement | Node): void => {
      if (element.nodeType === Node.ELEMENT_NODE) {
        const parent = element.parentNode;

        // Skip <span> with "typeblox-selected" class
        if (
          element.nodeName === "SPAN" &&
          (element as HTMLElement).classList.contains(CLASSES.selected)
        ) {
          Array.from(element.childNodes).forEach((child) =>
            removeFormatting(child),
          );
          return;
        }

        // Process all child nodes first (to handle deeply nested cases)
        Array.from(element.childNodes).forEach((child) =>
          removeFormatting(child),
        );

        // Unwrap formatting tags and preserve their content
        if (
          ["B", "I", "U", "S", "STRONG", "EM", "MARK", "SPAN"].includes(
            element.nodeName,
          )
        ) {
          while (element.firstChild) {
            parent?.insertBefore(element.firstChild, element);
          }
          parent?.removeChild(element);
        } else {
          // Remove inline styles if present
          if ((element as HTMLElement).style) {
            (element as HTMLElement).removeAttribute("style");
          }
        }
      }
    };

    const mergeTextNodes = (element: HTMLElement | Node): void => {
      let child = element.firstChild;
      while (child) {
        if (
          child.nodeType === Node.TEXT_NODE &&
          child.nextSibling?.nodeType === Node.TEXT_NODE
        ) {
          if (!child.textContent) child.textContent = "";
          child.textContent += child.nextSibling.textContent;
          child.parentNode?.removeChild(child.nextSibling);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          mergeTextNodes(child);
        }
        child = child.nextSibling;
      }
    };

    while (
      targetElement.parentElement?.textContent?.trim() ==
      targetElement.textContent?.trim()
    ) {
      targetElement = targetElement?.parentElement as HTMLElement;
      if ((targetElement as HTMLElement).matches("p[data-typeblox-editor]")) {
        break;
      }
    }

    // Apply formatting removal
    removeFormatting(targetElement);

    // Merge text nodes after cleanup
    mergeTextNodes(targetElement);
  };
}
