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
import { Block, BlockType } from "./.core/types";
import { typedom } from "./.core";
import useEditorStore from "./stores/EditorStore";
import "./styles/Editor.scss";

interface EditorProps {
  init: {
    toolbar: string;
    plugins?: string[];
    height?: number;
  };
  content: string;
  onChange: (updatedHTMLString: string) => void;
}

const Editor: React.FC<EditorProps> = ({ init, content, onChange }) => {
  typedom.init({
    HTMLString: content,
  });

  const [blocks, setBlocks] = useState<Block[]>(typedom.getBlocks());
  const { setToolbarSettings } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  useEffect(() => {
    const addedDividers = init.toolbar.replace(/\|/g, "divider");
    setToolbarSettings(addedDividers.split(" "));
  }, [init.toolbar, setToolbarSettings]);

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

  const handleUpdateBlock = (blockId: string, newContent: string) => {
    // Update the block content
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, content: newContent } : block,
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
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === currentBlockId);
      if (index === -1) return prev;

      const newBlock: Block = {
        id: Date.now().toString(), // Generate a unique ID for the new block
        type: newType,
        content: getDefaultContent(),
      };

      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });
    updateContent();
  };

  const getDefaultContent = () => {
    return "Write your content here...";
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
