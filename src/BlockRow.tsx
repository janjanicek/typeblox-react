import { useState, useRef, useEffect, FC, useCallback } from "react";
import Toolbar from "./Toolbar";
import Icon from "./components/Icon";
import ContextualMenu from "./components/ContextualMenu";
import { useFormatting } from "./utils/FormattingContext";
import useBlockStore from "./stores/BlockStore";
import { BlockType } from "./utils/types";
import React from "react";
import { sanitizeHTML } from "./utils/utils";

interface BlockRowProps {
  blockId: string;
  type: BlockType;
  content: string | null;
  dragListeners?: any;
  onUpdate: (blockId: string, content: string) => void;
  onAddBelow: (blockId: string, type: BlockType) => void;
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
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showDragMenu, setShowDragMenu] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [textMenuPosition, setTextMenuPosition] = useState({ top: 5, left: 0 });

  const contentRef = useRef<HTMLDivElement | null>(null);

  const { createSelectedElement, detectStyle, removeSelectedWrapper } =
    useFormatting();

  const { setDetectedStyles } = useBlockStore();

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

  useEffect(() => {
    setDetectedStyles(detectStyle());
  }, [setDetectedStyles, detectStyle]);

  const handleTextSelection = () => {
    removeSelectedWrapper(contentRef.current);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setTextMenuPosition({
        top: textMenuPosition.top,
        left: rect.left / 2,
      });

      const parentNode = range.commonAncestorContainer.parentNode;
      if (parentNode && !selection.isCollapsed) {
        setShowToolbar(true);
        createSelectedElement(range);
        setDetectedStyles(detectStyle());
        return;
      }

      setShowToolbar(false);
    }
  };

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        if ((e.target as HTMLElement).closest(".menu-container")) {
          return;
        }
        setShowToolbar(false);
        removeSelectedWrapper(contentRef.current);
      }
    },
    [removeSelectedWrapper],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default paste behavior

    // Get the pasted HTML or plain text
    const pastedHTML =
      e.clipboardData.getData("text/html") ||
      e.clipboardData.getData("text/plain");

    // Sanitize the HTML
    const cleanHTML = sanitizeHTML(pastedHTML);

    // Insert the sanitized HTML at the cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      range.deleteContents(); // Remove selected content, if any

      const fragment = range.createContextualFragment(cleanHTML);
      range.insertNode(fragment);

      // Collapse the selection to the end of the inserted content
      range.collapse(false); // `false` collapses the selection to the end
      selection.removeAllRanges(); // Clear any remaining selection
      selection.addRange(range); // Reset the collapsed range
    }

    // Update the parent state with the new content
    onUpdate(blockId, contentRef.current?.innerHTML || "");
  };

  const getWrapperType = () => {
    switch (type) {
      case "code":
        return "code";
      case "headline1":
        return "h1";
      case "headline2":
        return "h2";
      case "headline3":
        return "h3";
      default:
        break;
    }
    return "div";
  };

  const WrapperElement = getWrapperType();

  return (
    <div className="group relative flex items-start gap-2 py-2">
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowPlusMenu(!showPlusMenu)}
          className="w-6 h-6 flex items-center justify-center border border-0 rounded-full bg-white text-gray-700 hover:bg-gray-50"
        >
          <Icon src="/icons/plus.svg" />
        </button>
        <button
          onClick={() => {
            setTimeout(() => setShowDragMenu(!showDragMenu), 100);
          }}
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

      <ContextualMenu
        isVisible={showPlusMenu}
        position={{ top: 40, left: 0 }}
        options={[
          {
            label: "Text",
            onClick: () => onAddBelow(blockId, "text"),
            icon: "icons/align-left.svg",
          },
          {
            label: "Headline 1",
            onClick: () => onAddBelow(blockId, "headline1"),
            icon: "icons/h-1.svg",
          },
          {
            label: "Headline 2",
            onClick: () => onAddBelow(blockId, "headline2"),
            icon: "icons/h-2.svg",
          },
          {
            label: "Headline 3",
            onClick: () => onAddBelow(blockId, "headline3"),
            icon: "icons/h-3.svg",
          },
          {
            label: "Code",
            onClick: () => onAddBelow(blockId, "code"),
            icon: "icons/code.svg",
          },
          {
            label: "Image",
            onClick: () => onAddBelow(blockId, "image"),
            icon: "icons/photo.svg",
          },
        ]}
        onClose={() => setShowPlusMenu(false)}
      />

      <ContextualMenu
        isVisible={showDragMenu}
        position={{ top: 40, left: 20 }}
        options={[
          {
            label: "Remove Block",
            onClick: () => onRemove(blockId),
            icon: "icons/trash.svg",
          },
        ]}
        onClose={() => setShowDragMenu(false)}
      />

      {showToolbar && <Toolbar textMenuPosition={textMenuPosition} />}

      {["text", "code", "headline1", "headline2", "headline3"].includes(
        type,
      ) ? (
        React.createElement(WrapperElement, {
          ref: contentRef,
          "data-typedom-editor": "block",
          "data-typedom-id": blockId,
          contentEditable: true,
          suppressContentEditableWarning: true,
          className:
            "typedom flex-1 outline-none border border-transparent px-2",
          onBlur: () => onUpdate(blockId, contentRef.current?.innerHTML || ""),
          onPaste: handlePaste,
          onKeyUp: handleTextSelection,
          onMouseUp: handleTextSelection,
        })
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
