// SortableItem.jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import BlockRow from "./BlockRow";

export default function SortableItem({
  block,
  onUpdateBlock,
  onAddBlockBelow,
}) {
  const { id, type, content } = block;

  const {
    attributes,
    listeners, // Drag listeners for the handle
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <BlockRow
        blockId={id}
        type={type}
        content={content}
        dragListeners={listeners}
        onUpdate={onUpdateBlock}
        onAddBelow={onAddBlockBelow}
      />
    </div>
  );
}
