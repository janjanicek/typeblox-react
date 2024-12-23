import React, { useState, useRef, useEffect, FC } from "react";
import Toolbar from "./Toolbar";
import { toCssStyle } from "./utils/utils";
import Icon from "./components/Icon";

interface BlockRowProps {
  blockId: string;
  type: "text" | "code" | "image";
  content: string | null;
  dragListeners?: any;
  onUpdate: (blockId: string, content: string) => void;
  onAddBelow: (blockId: string, type: "text" | "code" | "image") => void;
  onRemove: (blockId: string) => void;
}

const BlockRow: FC<BlockRowProps> = ({
  blockId,
  type,
  content,
  dragListeners,
  onUpdate,
  onAddBelow,
  onRemove,
}) => {
  const [hovered, setHovered] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showDragMenu, setShowDragMenu] = useState(false);
  const [showTextMenu, setShowTextMenu] = useState(false);
  const [textMenuPosition, setTextMenuPosition] = useState({ top: 5, left: 0 });

  const contentRef = useRef<HTMLDivElement | null>(null);
  const savedSelection = useRef<Range | null>(null);

  useEffect(() => {
    if (
      content &&
      contentRef.current &&
      type !== "image" &&
      contentRef.current.innerHTML !== content
    ) {
      contentRef.current.innerHTML = content;
    }
  }, [content, type]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0); // Save the current range
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    selection?.removeAllRanges(); // Clear any existing selections
    if (savedSelection.current) {
      selection?.addRange(savedSelection.current); // Restore the saved range
    }
  };

  const handleTextSelection = () => {
    removeSelectedWrapper();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const rect = range.getBoundingClientRect();
      saveSelection();

      setTextMenuPosition({
        top: textMenuPosition.top,
        left: rect.left / 2,
      });

      const parentNode = range.commonAncestorContainer.parentNode;
      if (
        parentNode &&
        (parentNode as HTMLElement).classList?.contains("selected")
      ) {
        setShowTextMenu(true);
        return;
      }

      createSelectedElement(range);
      setShowTextMenu(true);
    }
  };

  const createSelectedElement = (range: Range) => {
    const wrapper = document.createElement("span");
    wrapper.className = "selected";
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
  };

  const removeSelectedWrapper = () => {
    if (!contentRef.current) return;

    const selectedElements = contentRef.current.querySelectorAll(".selected");
    selectedElements.forEach((element) => {
      const parent = element.parentNode;
      while (element.firstChild) {
        parent?.insertBefore(element.firstChild, element);
      }
      parent?.removeChild(element);
    });
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      if ((e.target as HTMLElement).closest(".menu-container")) {
        return;
      }
      setShowTextMenu(false);
      removeSelectedWrapper();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const detectStyle = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let currentNode = range.startContainer as Element;

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
        // Stop when reaching the `p[data-typos-editor]` element
        if (currentNode.matches("p[data-typos-editor]")) {
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
        if (!detectedStyles.isBold && computedStyle.fontWeight === "bold") {
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
    restoreSelection();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedElement = document.querySelector(".selected");

    if (!selectedElement) {
      createSelectedElement(range);
      contentRef.current?.normalize();
      onUpdate(blockId, contentRef.current?.innerHTML || "");
      return;
    }

    let matchingParent: HTMLElement | null = null;
    if (style) {
      const leadingStyle = Object.keys(style)[0];
      const styleKey = toCssStyle(leadingStyle);
      matchingParent = selectedElement.closest<HTMLElement>(
        `${tagName}[style*=${styleKey}]`,
      );
    }

    if (matchingParent) {
      Object.keys(style).forEach((key) => {
        (matchingParent as HTMLElement).style[key as any] = style[key];
      });
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

    contentRef.current?.normalize();
    onUpdate(blockId, contentRef.current?.innerHTML || "");
  };

  return (
    <div
      className="group relative flex items-start gap-2 py-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowPlusMenu(!showPlusMenu)}
          className="w-6 h-6 flex items-center justify-center border border-0 rounded-full bg-white text-gray-700 hover:bg-gray-50"
        >
          <Icon src="/icons/plus.svg" />
        </button>
        <button
          onMouseUp={() => setShowDragMenu(!showDragMenu)}
          {...dragListeners}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing border border-0 bg-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <circle cx="5" cy="5" r="1" />
            <circle cx="5" cy="12" r="1" />
            <circle cx="5" cy="19" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {showPlusMenu && (
        <div className="absolute left-10 top-0 bg-white border border-gray-300 shadow-lg p-2 z-10">
          <p
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => {
              setShowPlusMenu(false);
              onAddBelow(blockId, "text");
            }}
          >
            Add Text Block
          </p>
          <p
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => {
              setShowPlusMenu(false);
              onAddBelow(blockId, "code");
            }}
          >
            Add Code Block
          </p>
          <p
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => {
              setShowPlusMenu(false);
              onAddBelow(blockId, "image");
            }}
          >
            Add Image Block
          </p>
        </div>
      )}

      {showDragMenu && (
        <div className="absolute left-10 top-0 bg-white border border-gray-300 shadow-lg p-2 z-10">
          <p
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => {
              setShowDragMenu(false);
              onRemove(blockId);
            }}
          >
            Remove block
          </p>
        </div>
      )}

      {showTextMenu && (
        <Toolbar
          textMenuPosition={textMenuPosition}
          applyFormatting={applyFormatting}
          detectStyle={detectStyle}
          saveSelection={saveSelection}
          restoreSelection={restoreSelection}
        />
      )}

      {type === "text" || type === "code" ? (
        <div
          ref={contentRef}
          data-typos-editor="block"
          contentEditable
          suppressContentEditableWarning
          className="flex-1 outline-none border border-transparent px-2"
          onBlur={() => onUpdate(blockId, contentRef.current?.innerHTML || "")}
          onKeyUp={handleTextSelection}
          onMouseUp={handleTextSelection}
        />
      ) : type === "image" ? (
        <div className="flex-1">
          {content ? (
            <img
              src={content}
              alt="Uploaded"
              className="max-w-full h-auto border rounded"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files &&
                onUpdate(blockId, URL.createObjectURL(e.target.files[0]))
              }
              className="border p-2"
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default BlockRow;
