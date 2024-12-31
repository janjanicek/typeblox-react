import { useState, useRef, useEffect, FC, useCallback } from "react";
import Toolbar from "./components/Toolbar";
import { useFormatting } from "./utils/FormattingContext";
import useBlockStore from "./stores/BlockStore";
import { BlockType } from "./.core/types";
import React from "react";
import { sanitizeHTML } from "./.core/utils";
import BlockMenu from "./components/BlockMenu";
import { BLOCKS_SETTINGS } from "./.core/constants";

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

      if (contentRef.current) positionMenuAboveSelection(contentRef.current);

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

  const positionMenuAboveSelection = (parentRef: HTMLElement) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const parentRect = parentRef.getBoundingClientRect(); // Get the parent container's bounding box

      // Calculate menu position relative to the parent container
      const top = rect.top - parentRect.top;
      const left = rect.left - parentRect.left + rect.width / 2;

      // Apply constraints so the menu doesn't go outside the parent container
      const constrainedTop = Math.max(top, 0); // Prevent menu from going above the parent
      const constrainedLeft = Math.max(left, 0); // Prevent menu from going off the left side
      const constrainedRight = Math.min(left, parentRect.width); // Prevent menu from going off the right side

      setTextMenuPosition({
        top: constrainedTop,
        left: Math.min(constrainedLeft, constrainedRight),
      });
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
    const tagName = BLOCKS_SETTINGS[type].tag;
    if (tagName) return tagName;
    return "div";
  };

  const WrapperElement = getWrapperType();

  const renderContent = () => {
    if (type === "image") {
      return (
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
      );
    }

    // Default case for text, code, headline1, headline2, headline3, etc.
    return React.createElement(WrapperElement, {
      ref: contentRef,
      "data-typedom-editor": "block",
      "data-typedom-id": blockId,
      contentEditable: true,
      suppressContentEditableWarning: true,
      className: "typedom flex-1 outline-none border border-transparent px-2",
      onBlur: () => onUpdate(blockId, contentRef.current?.innerHTML || ""),
      onPaste: handlePaste,
      onKeyUp: handleTextSelection,
      onMouseUp: handleTextSelection,
    });
  };

  return (
    <>
      <div className="group relative flex items-start gap-2 py-2">
        <BlockMenu
          blockId={blockId}
          dragListeners={dragListeners}
          onAddBelow={onAddBelow}
          onRemove={onRemove}
        />
        {showToolbar && <Toolbar textMenuPosition={textMenuPosition} />}

        {renderContent()}
      </div>
    </>
  );
};

export default BlockRow;
