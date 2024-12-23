// Editor.jsx
import React, { useState } from "react";
// dnd-kit imports
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import { Block } from "./utils/types";

export default function Editor() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "text", content: "This is a text block." },
    { id: "2", type: "code", content: "// This is a code block." },
    { id: "3", type: "image", content: null },
  ]);

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
    console.log("handleUpdateBlock", blockId, newContent);
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
    newType: "text" | "code" | "image", // Restrict newType to specific block types
  ) => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === currentBlockId);
      if (index === -1) return prev;

      const newBlock: Block = {
        id: Date.now().toString(), // Generate a unique ID for the new block
        type: newType,
        content:
          newType === "code"
            ? "// Your code here..."
            : newType === "image"
              ? null // Image blocks don't need initial content
              : "New block...",
      };

      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });
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

  return (
    <div className="mx-auto mt-10 max-w-3xl p-4">
      <h1 className="text-2xl font-bold mb-4">Typedom Block Editor</h1>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
}
