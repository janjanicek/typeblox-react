import { useState, useRef, useEffect, FC } from "react";
import Toolbar from "./Toolbar";
import Icon from "./components/Icon";
import ContextualMenu from "./components/ContextualMenu";
import { useFormatting } from "./utils/FormattingContext";
import useBlockStore from "./stores/BlockStore";

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

  const { createSelectedElement, detectStyle } = useFormatting();

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
    console.log("handleTextSelection", selection);
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

      <ContextualMenu
        isVisible={showPlusMenu}
        position={{ top: 40, left: 20 }}
        options={[
          {
            label: "Add Text Block",
            onClick: () => onAddBelow(blockId, "text"),
          },
          {
            label: "Add Code Block",
            onClick: () => onAddBelow(blockId, "code"),
          },
          {
            label: "Add Image Block",
            onClick: () => onAddBelow(blockId, "image"),
          },
        ]}
        onClose={() => setShowPlusMenu(false)}
      />

      <ContextualMenu
        isVisible={showDragMenu}
        position={{ top: 40, left: 50 }}
        options={[{ label: "Remove Block", onClick: () => onRemove(blockId) }]}
        onClose={() => setShowDragMenu(false)}
      />

      {showTextMenu && (
        <Toolbar
          textMenuPosition={textMenuPosition}
          saveSelection={saveSelection}
          restoreSelection={restoreSelection}
        />
      )}

      {type === "text" || type === "code" ? (
        <div
          ref={contentRef}
          data-typedom-editor="block"
          data-typedom-id={blockId}
          contentEditable
          suppressContentEditableWarning
          className="typedom flex-1 outline-none border border-transparent px-2"
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
