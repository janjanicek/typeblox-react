// Editor.jsx
import React, { useCallback, useEffect, useState } from "react";
// dnd-kit imports
import {
  DndContext,
  useSensor,
  MouseSensor,
  KeyboardSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import { BlockType } from "@typeblox/core/dist/types";
import useEditorStore from "../stores/EditorStore";
import "../styles/editor.scss";
import {
  AVAILABLE_BLOCKS,
  BLOCK_TYPES,
  DEFAULT_TOOLBARS,
  EVENTS,
} from "@typeblox/core/dist/constants";
import { useTypebloxEditor } from "../context/EditorContext";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import { imageUploadFunction } from "../utils/types";
import { DEFAULT_MENUS } from "../utils/constants";

interface EditorProps {
  toolbars?: Partial<Record<BlockType, string>>;
  menus?: Partial<Record<string, Array<string>>>;
  extensions?: Record<string, string>;
  height?: number;
}

const Editor: React.FC<EditorProps> = ({
  toolbars = DEFAULT_TOOLBARS,
  menus = DEFAULT_MENUS,
}) => {
  const { editor, onChange, onImageUpload } = useTypebloxEditor();

  const [blocks, setBlocks] = useState<Blox[]>(editor.blox().getBlox());
  const { setToolbarSettings, setMenuSettings } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const { isAllSelected, setIsAllSelected } = useEditorStore();

  // Debounce timeout
  let debounceTimeout: NodeJS.Timeout;

  // Handle content updates with debounce
  const updateContent = useCallback(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      editor.blox().update(onChange, blocks);
    }, 300);
  }, [editor, onChange, blocks]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+A (or Ctrl+A for Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "a") {
        event.preventDefault();
        setIsAllSelected(true);
      }

      // Backspace to delete all blocks
      if (event.key === "Backspace" && isAllSelected) {
        event.preventDefault();
        setBlocks([createNewBlox(BLOCK_TYPES.text)]); // Clear all blocks
        setIsAllSelected(false);
        updateContent();
      }
    };

    // Attach the event listener to the editor
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAllSelected, setIsAllSelected, setBlocks]);

  // Update content whenever blocks change
  useEffect(() => {
    updateContent();
    return () => clearTimeout(debounceTimeout);
  }, [blocks, updateContent]);

  useEffect(() => {
    const handleBlocksChange = (newBlocks: Blox[]) => {
      // Update the blocks state directly
      setBlocks(newBlocks);
    };

    const handleStyleChange = (updatedBlock: Blox): void => {
      if (!updatedBlock) return;
      // Update the blocks state to reflect the style change
      setBlocks((prevBlocks) =>
        prevBlocks.map((block) => {
          if (block.id === updatedBlock.id) {
            return Object.assign(new Blox(block), {
              styles: updatedBlock.styles,
            });
          }
          return block;
        }),
      );
    };

    editor.on(EVENTS.blocksChanged, handleBlocksChange);
    editor.on(EVENTS.styleChange, handleStyleChange);
    return () => {
      editor.off(EVENTS.blocksChanged, handleBlocksChange);
      editor.off(EVENTS.styleChange, handleStyleChange);
    };
  }, [editor]);

  useEffect(() => {
    if (!toolbars || typeof toolbars !== "object") return;

    const mergedToolbars = {
      ...DEFAULT_TOOLBARS,
      ...toolbars,
    };

    const mergedMenus = {
      ...DEFAULT_MENUS,
      ...menus,
    };

    const updatedToolbar: Record<BlockType, string> = Object.fromEntries(
      Object.entries(mergedToolbars).map(([key, value]) => [
        key,
        value.replace(/\|/g, "divider"),
      ]),
    ) as Record<BlockType, string>;

    Object.entries(updatedToolbar).forEach(([blockType, tools]) => {
      setToolbarSettings(blockType as BlockType, tools.split(" ") ?? []);
    });

    Object.entries(mergedMenus).forEach(([menuName, modules]) => {
      setMenuSettings(menuName, modules ?? []);
    });
  }, [toolbars, setToolbarSettings, menus, setMenuSettings]);

  // Handle drag-and-drop reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
    // updateContent();
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setOverId(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      // Not moving
      setOverId(activeId);
      return;
    }

    const activeIndex = blocks.findIndex((block) => block.id === activeId);
    const overIndex = blocks.findIndex((block) => block.id === overId);

    if (activeIndex > overIndex) {
      // Moving up
      setOverId(overId);
    } else {
      // Moving down
      const nextBlock = blocks[overIndex + 1];
      setOverId(nextBlock ? nextBlock.id : overId);
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null); // Reset the drop target
  };

  const handleUpdateBlock = (update: {
    id: string;
    content?: string;
    type?: BlockType;
  }) => {
    const updatedBlocks = blocks.map((block) => {
      if (block.id === update.id) {
        // Update content and type if provided
        if (update.content !== undefined) {
          block.content = update.content;
        }
        if (update.type) {
          block.type = update.type;
        }
      }
      return block;
    });

    setBlocks(updatedBlocks);
  };

  const createNewBlox = (newType: BlockType) => {
    const newBlockId = Date.now().toString();

    return new Blox({
      id: newBlockId, // Generate a unique ID for the new block
      type: newType,
      content: "",
      onUpdate: editor.onChange,
      TypingManager: editor.selection(),
      StyleManager: editor.style(),
      PasteManager: editor.paste(),
    });
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);

  return (
    <div id="typeblox-editor">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        sensors={sensors}
      >
        {/* Sortable context for the blocks */}
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableItem
              blocks={blocks}
              key={block.id}
              block={block}
              onUpdateBlock={handleUpdateBlock}
              isOver={block.id === overId}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeId &&
            (() => {
              const activeBlock = blocks.find((item) => item.id === activeId);

              return activeBlock ? (
                <SortableItem
                  blocks={blocks}
                  key={activeBlock.id}
                  block={activeBlock}
                  onUpdateBlock={handleUpdateBlock}
                  isDragging={true}
                />
              ) : null;
            })()}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Editor;
