import { useState, useRef, useEffect, FC, useCallback } from "react";
import Toolbar from "./Toolbar";
import { useTypebloxEditor } from "../context/EditorContext";
import { BlockType } from "@typeblox/core/dist/types";
import React from "react";
import BlockMenu from "./BlockMenu";
import {
  AVAILABLE_BLOCKS,
  BLOCKS_SETTINGS,
  BLOCK_TYPES,
  DEFAULT_BLOCK_TYPE,
} from "@typeblox/core/dist/constants";
import ContextualMenu from "./ContextualMenu";
import type { Blox } from "@typeblox/core/dist/classes/Blox";
import { Image } from "./blox/Image";
import useEditorStore from "../stores/EditorStore";
import { BlockProvider } from "../context/BlockContext";
import { List } from "./blox/List";
import { Code } from "./blox/Code";

interface BlockRowProps {
  blocks: Blox[];
  block: Blox;
  type: BlockType;
  content: string | null;
  dragListeners?: any;
  onUpdate: (update: {
    id: string;
    content?: string;
    type?: BlockType;
  }) => void;
}

const BlockRow: FC<BlockRowProps> = ({
  blocks,
  block,
  type,
  content,
  dragListeners,
  onUpdate,
}) => {
  const { isAllSelected, setIsAllSelected } = useEditorStore();

  const [showToolbar, setShowToolbar] = useState(false);
  const [showContentSuggestor, setShowContentSuggestor] = useState(false);
  const [isBlockSelected, setIsBlockSelected] = useState(isAllSelected);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const { editor } = useTypebloxEditor();

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
    setIsBlockSelected(isAllSelected);
  }, [isAllSelected]);

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
    const blockElement = editor.getBlockElementById(block.id);

    if (event.key === "/") {
      if (blockElement?.innerHTML.trim() === "/") {
        setShowContentSuggestor(true);
        editor.elements().focusBlock(block.id, true);
      } else {
        setShowContentSuggestor(false);
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
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
  };

  const getPreviousBlock = (currentBlockId: string): Blox | null => {
    const currentIndex = blocks.findIndex(
      (block) => block.id === currentBlockId,
    );
    return currentIndex > 0 ? blocks[currentIndex - 1] : null;
  };

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Node;

      const isInsideBlock = contentRef.current?.contains(target);
      const isInsideMenu = (e.target as HTMLElement).closest(
        ".tbx-contextual-menu",
      );
      const isInsideToolbar = (e.target as HTMLElement).closest(".tbx-toolbar");
      const isInsideModal = (e.target as HTMLElement).closest(".tbx-modal");
      if (isInsideBlock || isInsideMenu || isInsideToolbar || isInsideModal) {
        return;
      }

      // Handle unselecting and hiding toolbar
      setIsBlockSelected(false);
      setIsAllSelected(false);
      setShowToolbar(false);

      const blockElement = (e.target as HTMLElement).closest(
        "[data-typeblox-id]",
      );
      if (!blockElement) return;

      const blockId = blockElement.getAttribute("data-typeblox-id");
      const selectedBlock = editor.blox().getCurrentBlock();
      const currentBlock = editor.getBlockElementById(blockId ?? undefined);

      const selection = window.getSelection();
      const hasNoSelection =
        !selection ||
        selection.isCollapsed ||
        selectedBlock?.getContentElement() !== currentBlock;

      if (hasNoSelection) {
        editor.unselect(contentRef.current);
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
    editor.blox().getCurrentBlock()?.pasteContent(e.nativeEvent);
    e.preventDefault(); // Prevent default paste behavior
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const blockElement = editor.getBlockElementById(block.id);

    // Check if backspace is pressed and the block is empty
    if (event.key === "Backspace") {
      if (
        editor.selection().isCursorAtStart() &&
        blockElement &&
        blockElement.innerHTML.trim() !== ""
      ) {
        // Merge the current block with the previous block
        const previousBlock = getPreviousBlock(block.id);
        if (previousBlock && previousBlock.id) {
          editor.blox().merge(block.id);
          event.preventDefault();
        }
      } else if (blockElement && blockElement.innerHTML.trim() === "") {
        // Handle empty block case
        const previousBlock = getPreviousBlock(block.id);
        if (previousBlock && previousBlock.id) {
          editor.elements().focusBlock(previousBlock.id, true);
        }
        editor.blox().removeById(block.id);
        event.preventDefault();
      }
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();

      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        return;
      }

      let range = selection.getRangeAt(0);
      const br = document.createElement("br");
      range.insertNode(br);
      const space = document.createTextNode("\u00A0"); // Non-breaking space
      range.insertNode(space);
      range.collapse(false);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const blockElement = editor.elements().getBlockElementById(block.id);
      if (!blockElement) return;

      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      if (editor.selection().isCursorAtEnd(blockElement)) {
        // Cursor is at the end of the block, add a new one
        editor.blox().addBlockAfter(block.id, DEFAULT_BLOCK_TYPE);
      } else if (editor.selection().isCursorAtStart(blockElement)) {
        editor.blox().addBlockBefore(block.id, DEFAULT_BLOCK_TYPE);
      } else {
        editor.blox().split(block.id);
      }
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "a") {
      if (!isBlockSelected) {
        event.stopPropagation();
        setIsBlockSelected(true); // Select this block
      } else {
        event.preventDefault();
      }
    }
  };

  const getWrapperType = () => {
    const tagName = BLOCKS_SETTINGS[type].tag;
    if (tagName) return tagName;
    return "div";
  };

  const WrapperElement = getWrapperType();

  const renderContent = () => {
    if (type === BLOCK_TYPES.image) {
      return (
        <Image
          ref={contentRef}
          block={block}
          content={content}
          onUpdate={onUpdate}
          setShowToolbar={setShowToolbar}
          showToolbar={showToolbar}
        />
      );
    }

    if (
      type === BLOCK_TYPES.numberedList ||
      type === BLOCK_TYPES.bulletedList
    ) {
      return (
        <List
          ref={contentRef}
          block={block}
          content={content}
          onUpdate={onUpdate}
          setShowToolbar={setShowToolbar}
          showToolbar={showToolbar}
          handleMouseUp={handleMouseUp}
        />
      );
    }

    if (type === BLOCK_TYPES.code) {
      return (
        <Code
          ref={contentRef}
          block={block}
          content={content}
          onUpdate={onUpdate}
          setShowToolbar={setShowToolbar}
          showToolbar={showToolbar}
          handleMouseUp={handleMouseUp}
        />
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
      className: `typeblox flex-1 outline-none px-2 ${block.getClasses().join(" ")}`,
      style: block.getStyles(),
      onBlur: () =>
        onUpdate({
          id: block.id,
          content: contentRef.current?.innerHTML || "",
        }),
      onPaste: handlePaste,
      onKeyUp: handleKeyUp,
      onMouseUp: handleMouseUp,
      onKeyDown: handleKeyDown,
    });
  };

  return (
    <BlockProvider
      block={block}
      setShowToolbar={setShowToolbar}
      onUpdate={onUpdate}
      dragListeners={dragListeners}
    >
      <div
        className="tbx-block relative flex items-start gap-2 py-2"
        data-is-selected={isBlockSelected}
      >
        <BlockMenu />
        {showToolbar && (
          <Toolbar
            block={block}
            onUpdate={onUpdate}
            setShowToolbar={setShowToolbar}
            dragListeners={dragListeners}
          />
        )}
        {renderContent()}
        <ContextualMenu
          referenceElement={contentRef.current}
          isVisible={showContentSuggestor}
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
                setTimeout(() => editor.elements().focusBlock(block.id), 100);
              },
              icon: BLOCKS_SETTINGS[item].icon,
            };
          })}
          onClose={() => setShowContentSuggestor(false)}
        />
      </div>
    </BlockProvider>
  );
};

export default BlockRow;
