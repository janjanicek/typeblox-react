import { useState, useRef, useEffect, FC, useCallback } from "react";
import Toolbar from "./Toolbar";
import { useEditor } from "../utils/EditorContext";
import { Block, BlockType } from "../.core/types";
import React from "react";
import { sanitizeHTML } from "../.core/utils/dom";
import BlockMenu from "./BlockMenu";
import {
  AVAILABLE_BLOCKS,
  BLOCKS_SETTINGS,
  DEFAULT_BLOCK_TYPE,
} from "../.core/constants";
import { focusBlock } from "../.core/utils/blocks";
import ContextualMenu from "./ContextualMenu";

interface BlockRowProps {
  blocks: Block[];
  block: Block;
  type: BlockType;
  content: string | null;
  dragListeners?: any;
  onUpdate: (update: {
    id: string;
    content?: string;
    type?: BlockType;
  }) => void;
  onAddBelow: (blockId: string, type: BlockType) => void;
  onRemove: (blockId: string) => void;
}

const BlockRow: FC<BlockRowProps> = ({
  blocks,
  block,
  type,
  content,
  dragListeners,
  onUpdate,
  onAddBelow,
  onRemove,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showContentSuggestor, setShowContentSuggestor] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const { editor } = useEditor();

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
    const editorElement = contentRef.current;

    if (editorElement) {
      editorElement.addEventListener("input", () => {
        if (editorElement.innerHTML === "<br>") {
          editorElement.innerHTML = "";
        }
      });
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener("input", () => {});
      }
    };
  }, []);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const blockElement = getBlockElement();

    editor.unselect(contentRef.current);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const parentNode = range.commonAncestorContainer.parentNode;
      if (parentNode && !selection.isCollapsed) {
        editor.select(range);
        setShowToolbar(true);
        return;
      }

      setShowToolbar(false);
    }

    if (event.key === "/") {
      if (blockElement?.innerHTML.trim() === "/") {
        setShowContentSuggestor(true);
        focusBlock(block.id, true);
      } else {
        setShowContentSuggestor(false);
      }
    }
  };

  const getPreviousBlock = (currentBlockId: string): Block | null => {
    const currentIndex = blocks.findIndex(
      (block) => block.id === currentBlockId,
    );
    return currentIndex > 0 ? blocks[currentIndex - 1] : null;
  };

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        const blockElement = (e.target as HTMLElement).closest(
          "[data-typeblox-id]",
        );
        if (!blockElement) return;
        const blockId = (blockElement as HTMLElement).dataset.typebloxId;

        const selectedBlock = editor.getCurrentBlock();
        const currentBlock = editor.getBlockElementById(blockId);

        // Check if there is any selection on the page
        const selection = window.getSelection();
        if (
          !selection ||
          selection.isCollapsed ||
          selectedBlock !== currentBlock
        ) {
          // Only unselect if no text or element is selected
          setShowToolbar(false);
          editor.unselect(contentRef.current);
        }
      }
    },
    [editor],
  );

  useEffect(() => {
    document.addEventListener("mouseup", handleOutsideClick);
    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
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
    onUpdate({ id: block.id, content: contentRef.current?.innerHTML || "" });
  };

  const getBlockElement = () =>
    document.querySelector(`[data-typeblox-id="${block.id}"]`);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const blockElement = getBlockElement();

    // Check if backspace is pressed and the block is empty
    if (event.key === "Backspace") {
      if (blockElement && blockElement.innerHTML.trim() === "") {
        const previousBlock = getPreviousBlock(block.id);
        if (previousBlock && previousBlock.id) {
          focusBlock(previousBlock.id, true);
        }
        onRemove(block.id);
        event.preventDefault();
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onAddBelow(block.id, DEFAULT_BLOCK_TYPE);
      focusBlock(block.id, true);
    }
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
                onUpdate({
                  id: block.id,
                  content: URL.createObjectURL(e.target.files[0]),
                })
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
      "data-typeblox-editor": "block",
      "data-typeblox-id": block.id,
      placeholder: BLOCKS_SETTINGS[type].defaultContent,
      contentEditable: true,
      suppressContentEditableWarning: true,
      className: "typeblox flex-1 outline-none border border-transparent px-2",
      onBlur: () =>
        onUpdate({
          id: block.id,
          content: contentRef.current?.innerHTML || "",
        }),
      onPaste: handlePaste,
      onKeyUp: handleKeyUp,
      onMouseUp: handleKeyUp,
      onKeyDown: handleKeyDown,
    });
  };

  return (
    <>
      <div className="group relative flex items-start gap-2 py-2">
        <BlockMenu
          blockId={block.id}
          dragListeners={dragListeners}
          onAddBelow={onAddBelow}
          onRemove={onRemove}
        />
        {showToolbar && <Toolbar block={block} onUpdate={onUpdate} />}
        {renderContent()}
        <ContextualMenu
          isVisible={showContentSuggestor}
          position={{ top: 40, left: 0 }}
          sectionName="Turn into"
          options={AVAILABLE_BLOCKS.map((item: BlockType) => {
            return {
              label: BLOCKS_SETTINGS[item].visibleName,
              description: BLOCKS_SETTINGS[item].description,
              onClick: () => {
                onUpdate({
                  id: block.id,
                  content: block.content?.replace(/\/$/, "") || "",
                  type: item,
                });
                setTimeout(() => focusBlock(block.id), 100);
              },
              icon: BLOCKS_SETTINGS[item].icon,
            };
          })}
          onClose={() => setShowContentSuggestor(false)}
        />
      </div>
    </>
  );
};

export default BlockRow;
