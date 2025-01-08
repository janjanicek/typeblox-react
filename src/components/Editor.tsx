// Editor.jsx
import React, { useEffect, useState } from "react";
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
import { BlockType } from "../.core/types";
import useEditorStore from "../stores/EditorStore";
import "../styles/Editor.scss";
import { DEFAULT_TOOLBARS, EVENTS } from "../.core/constants";
import { useEditor } from "../utils/EditorContext";
import { Blox } from "../.core/classes/Blox";

interface EditorProps {
  toolbars?: Partial<Record<BlockType, string>>;
  extensions?: string[];
  height?: number;
  onChange: (updatedHTMLString: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  toolbars = DEFAULT_TOOLBARS,
  onChange,
}) => {
  const { editor } = useEditor();

  const [blocks, setBlocks] = useState<Blox[]>(editor.getBlocks());
  const { setToolbarSettings } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  // Debounce timeout
  let debounceTimeout: NodeJS.Timeout;

  // Handle content updates with debounce
  const updateContent = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      editor.update(onChange, blocks);
    }, 300);
  };

  // Update content whenever blocks change
  useEffect(() => {
    updateContent();
    return () => clearTimeout(debounceTimeout);
  }, [blocks, updateContent]);

  useEffect(() => {
    const handleBlocksChange = (newBlocks: Blox[]) => {
      setBlocks(newBlocks); // Update local state when blocks change in the editor
    };

    editor.on(EVENTS.blocksChanged, handleBlocksChange);
    return () => {
      editor.off(EVENTS.blocksChanged, handleBlocksChange);
    };
  }, [editor]);

  useEffect(() => {
    if (!toolbars || typeof toolbars !== "object") return;

    const mergedToolbars = {
      ...DEFAULT_TOOLBARS,
      ...toolbars,
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
  }, [toolbars, setToolbarSettings]);

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

  const handleAddBlockBelow = (
    currentBlockId: string,
    newType: BlockType, // Restrict newType to specific block types
  ) => {
    const newBlockId = Date.now().toString();

    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === currentBlockId);
      if (index === -1) return prev;

      const newBlock: Blox = new Blox({
        id: newBlockId, // Generate a unique ID for the new block
        type: newType,
        content: getDefaultContent(newType),
        onUpdate: editor.onChange,
        TypingManager: editor.selection(),
        FormatManager: editor.format(),
        PasteManager: editor.paste(),
      });

      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    setTimeout(() => {
      editor.DOM().focusBlock(newBlockId);
    }, 0);
  };

  const getDefaultContent = (type: BlockType) => {
    return "";
  };

  const handleRemoveBlock = (blockId: string) => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === blockId);
      if (index === -1) return prev; // If the block doesn't exist, return the previous state

      const newBlocks = [...prev];
      newBlocks.splice(index, 1); // Remove the block at the found index
      return newBlocks;
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
    <div className="mx-auto mt-10 max-w-3xl p-4" id="typeblox-editor">
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
              editor={editor}
              blocks={blocks}
              key={block.id}
              block={block}
              onUpdateBlock={handleUpdateBlock}
              onAddBlockBelow={handleAddBlockBelow}
              onRemoveBlock={handleRemoveBlock}
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
                  editor={editor}
                  blocks={blocks}
                  key={activeBlock.id}
                  block={activeBlock}
                  onUpdateBlock={handleUpdateBlock}
                  onAddBlockBelow={handleAddBlockBelow}
                  onRemoveBlock={handleRemoveBlock}
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
