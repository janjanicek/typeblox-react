import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import BlockRow from "./BlockRow";
import { BlockType } from "@typeblox/core/dist/types";
import { Blox } from "@typeblox/core/dist/classes/Blox";

interface SortableItemProps {
  block: Blox;
  onUpdateBlock: (update: {
    id: string;
    content?: string;
    type?: BlockType;
  }) => void;
  isDragging?: boolean;
  isOver?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({
  block,
  onUpdateBlock,
  isDragging = false,
  isOver = false,
}) => {
  const { id, type, content } = block;

  // Create a RefObject specifically for HTMLElement
  const contentRef = useRef<HTMLElement>(null!); // Use a non-null assertion (!)

  const { attributes, listeners, setNodeRef, transition } = useSortable({ id });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    borderTop: isOver ? "2px solid black" : 0,
    transition,
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node); // Attach the sortable node reference
        if (node) contentRef.current = node as HTMLElement; // Explicitly set contentRef
      }}
      style={style}
      {...attributes}
    >
      <BlockRow
        block={block}
        type={type}
        content={content}
        dragListeners={listeners}
        onUpdate={onUpdateBlock}
      />
    </div>
  );
};

export default SortableItem;
