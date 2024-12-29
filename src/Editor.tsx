// Editor.jsx
import React, { useEffect, useState } from "react";
// dnd-kit imports
import {
  DndContext,
  closestCenter,
  useSensor,
  MouseSensor,
  KeyboardSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import { Block, BlockType } from "./utils/types";
import useEditorStore from "./stores/EditorStore";
import "./styles/Editor.scss";

interface EditorProps {
  init: {
    toolbar: string;
    plugins?: string[];
    height?: number;
  };
}

const Editor: React.FC<EditorProps> = ({ init }) => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "headline1", content: "This is headline." },
    { id: "2", type: "text", content: "This is a text block." },
    { id: "3", type: "code", content: "// This is a code block." },
    { id: "4", type: "image", content: null },
  ]);

  const { setToolbarSettings } = useEditorStore();

  useEffect(() => {
    const addedDividers = init.toolbar.replace(/\|/g, "divider");
    setToolbarSettings(addedDividers.split(" "));
  }, [init.toolbar, setToolbarSettings]);

  // Handle drag-and-drop reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  // Update a block's content
  const handleUpdateBlock = (blockId: string, newContent: string) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, content: newContent } : block,
    );
    setBlocks(updatedBlocks);

    // Combine all blocks into a single HTML string with <p> wrappers
    // const combinedHTML = updatedBlocks
    //   .map((block) => `<p>${block.content}</p>`)
    //   .join("");
    //  console.log("Editor Content:", combinedHTML);
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
        sensors={sensors}
      >
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
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Editor;
