import {
  useState,
  useRef,
  useEffect,
  FC,
  useCallback,
  ReactNode,
  RefObject,
} from "react";
import Toolbar from "./Toolbar";
import { useTypebloxEditor } from "../context/EditorContext";
import { BlockType } from "@typeblox/core/dist/types";
import React from "react";
import BlockMenu from "./menus/BlockMenu";
import {
  getAvailableBlocks,
  getBlockSettings,
  BLOCK_TYPES,
} from "@typeblox/core/dist/blockTypes";
import ContextualMenu from "./menus/ContextualMenu";
import type { Blox } from "@typeblox/core/dist/classes/Blox";
import { Image } from "./blox/Image";
import { Video } from "./blox/Video";
import { BlockProvider } from "../context/BlockContext";
import { Code } from "./blox/Code";
import useEditorStore from "../stores/EditorStore";
import { useToolbar } from "../context/ToolbarContext";
import { getRange } from "../utils/helpers";

interface BlockRowProps {
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
  block,
  type,
  content,
  dragListeners,
  onUpdate,
}) => {
  const [showContentSuggestor, setShowContentSuggestor] = useState(false);

  const { setCurrentBlock } = useEditorStore();
  const { activeBlockId, hide, show } = useToolbar();

  const blockMenuReference = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const { editor, editorSettings } = useTypebloxEditor();
  const blockSettings = getBlockSettings();

  useEffect(() => {
    if (
      content &&
      contentRef.current &&
      type !== BLOCK_TYPES.image &&
      type !== BLOCK_TYPES.video &&
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
    setCurrentBlock(block);
    const blockElement = (event.target as HTMLElement).closest(
      "[data-typeblox-id]",
    ) as HTMLElement;
    const blockId = blockElement?.dataset.typebloxId;
    if (block.id !== blockId) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentNode = range.commonAncestorContainer.parentNode;
      if (parentNode && !selection.isCollapsed) {
        editor.select(range);
        show(block.id);
        return;
      }
    }
    if (editorSettings?.toolbarShowPermanently) {
      show(block.id);
    }
  };

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Node;

      const isInsideEditor = (target as HTMLElement).closest(
        "#typeblox-editor",
      );
      const isInsideBlock =
        contentRef.current === target || contentRef.current?.contains(target);
      const isInsideMenu = (e.target as HTMLElement).closest(
        ".tbx-contextual-menu",
      );
      const isInsideToolbar = (e.target as HTMLElement).closest(".tbx-toolbar");
      const isInsideModal = (e.target as HTMLElement).closest(".tbx-modal");
      if (
        isInsideBlock ||
        isInsideMenu ||
        isInsideToolbar ||
        isInsideModal ||
        editorSettings?.toolbarShowPermanently
      ) {
        return;
      }

      // Handle unselecting and hiding toolbar
      if (editor.blox().isAllSelected()) editor.blox().selectAllBlox(false);
      if (editor.getBlockById(block.id)?.isSelected)
        editor.getBlockById(block.id)?.setIsSelected(false);

      const range = getRange();

      if (
        (!isInsideEditor && activeBlockId !== block.id) ||
        (!isInsideMenu && !range)
      ) {
        hide();
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

  const getWrapperType = () => {
    const tagName = blockSettings[type].tag;
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
        />
      );
    }

    if (type === BLOCK_TYPES.video) {
      return (
        <Video
          ref={contentRef}
          block={block}
          content={content}
          onUpdate={onUpdate}
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
          handleMouseUp={handleMouseUp}
        />
      );
    }

    // Default case for text, code, headline1, headline2, headline3, etc.
    return React.createElement(WrapperElement, {
      ref: contentRef,
      "data-typeblox-editor": "block",
      "data-typeblox-id": block.id,
      placeholder: blockSettings[type].placeholder,
      contentEditable: true,
      suppressContentEditableWarning: true,
      className: `typeblox outline-none ${block.getClasses().join(" ")}`,
      style: block.getStyles(),
      onBlur: () => {
        onUpdate({
          id: block.id,
          content: contentRef.current?.innerHTML || "",
        });
      },
      onPaste: handlePaste,
      onKeyUp: handleKeyUp,
      onMouseUp: handleMouseUp,
    });
  };

  return (
    <BlockProvider
      block={block}
      onUpdate={onUpdate}
      dragListeners={dragListeners}
    >
      <div
        className="tbx-block relative"
        data-is-selected={block.isSelected}
        ref={blockMenuReference}
      >
        <BlockMenu referenceElement={blockMenuReference} />
        {editorSettings?.toolbarType === "inline" && <Toolbar />}
        {renderContent()}
        <ContextualMenu
          referenceElement={contentRef.current}
          isVisible={showContentSuggestor}
          sectionName="Turn into"
          options={getAvailableBlocks().map((item: BlockType) => {
            return {
              label: blockSettings[item]?.visibleName,
              description: blockSettings[item]?.description,
              onClick: () => {
                onUpdate({
                  id: block.id,
                  content: block.content?.replace(/\/$/, "") || "",
                  type: item,
                });
                setTimeout(() => editor.elements().focusBlock(block.id), 100);
              },
              icon: blockSettings[item]?.icon,
              idonElement: blockSettings[item]?.iconElement as ReactNode,
            };
          })}
          onClose={() => setShowContentSuggestor(false)}
        />
      </div>
    </BlockProvider>
  );
};

export default BlockRow;
