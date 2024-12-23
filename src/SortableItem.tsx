import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import BlockRow from "./BlockRow";
import { Block } from "./utils/types";

interface SortableItemProps {
  block: Block;
  onUpdateBlock: (blockId: string, content: string) => void;
  onAddBlockBelow: (blockId: string, type: "text" | "code" | "image") => void;
  onRemoveBlock: (blockId: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  block,
  onUpdateBlock,
  onAddBlockBelow,
  onRemoveBlock,
}) => {
  const { id, type, content } = block;

  const {
    attributes,
    listeners, // Drag listeners for the handle
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: React.CSSProperties = {
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
        onRemove={onRemoveBlock}
      />
    </div>
  );
};

export default SortableItem;
