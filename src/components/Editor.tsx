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
import { Block, BlockType } from "../.core/types";
import { focusBlock } from "../.core/blocks";
import { typedom } from "../.core";
import useEditorStore from "../stores/EditorStore";
import "../styles/Editor.scss";
import { DEFAULT_TOOLBARS, EVENTS } from "../.core/constants";

interface EditorProps {
  toolbars?: Partial<Record<BlockType, string>>;
  plugins?: string[];
  height?: number;
  content: string;
  onChange: (updatedHTMLString: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  toolbars = DEFAULT_TOOLBARS,
  content,
  onChange,
}) => {
  typedom.init({
    HTMLString: content,
  });

  const [blocks, setBlocks] = useState<Block[]>(typedom.getBlocks());
  const { setToolbarSettings } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  useEffect(() => {
    const handleBlocksChange = () => {
      setBlocks(typedom.getBlocks()); // Update state with the latest blocks
    };
    typedom.on(EVENTS.blocksChanged, handleBlocksChange);
    return () => {
      typedom.off(EVENTS.blocksChanged, handleBlocksChange);
    };
  }, []);

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
    updateContent();
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
    const updatedBlocks = blocks.map((block) =>
      block.id === update.id
        ? {
            ...block,
            ...(update.content !== undefined
              ? { content: update.content }
              : {}), // Update content if provided
            ...(update.type ? { type: update.type } : {}), // Update type if provided
          }
        : block,
    );

    setBlocks(updatedBlocks);
    updateContent();
  };

  const updateContent = () => {
    typedom.update(onChange, blocks);
  };

  const handleAddBlockBelow = (
    currentBlockId: string,
    newType: BlockType, // Restrict newType to specific block types
  ) => {
    const newBlockId = Date.now().toString();

    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === currentBlockId);
      if (index === -1) return prev;

      const newBlock: Block = {
        id: newBlockId, // Generate a unique ID for the new block
        type: newType,
        content: getDefaultContent(newType),
      };

      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    setTimeout(() => {
      focusBlock(newBlockId);
    }, 0);

    updateContent();
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
    updateContent();
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);

  return (
    <div className="mx-auto mt-10 max-w-3xl p-4" id="typedom-editor">
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
