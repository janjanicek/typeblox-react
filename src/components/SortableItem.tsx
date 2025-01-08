import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import BlockRow from "./BlockRow";
import { Typeblox } from "../.core";
import { BlockType } from "../.core/types";
import { Blox } from ".core/classes/Blox";

interface SortableItemProps {
  editor: Typeblox;
  blocks: Blox[];
  block: Blox;
  onUpdateBlock: (update: {
    id: string;
    content?: string;
    type?: BlockType;
  }) => void;
  onAddBlockBelow: (blockId: string, type: BlockType) => void;
  onRemoveBlock: (blockId: string) => void;
  isDragging?: boolean;
  isOver?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({
  editor,
  blocks,
  block,
  onUpdateBlock,
  onAddBlockBelow,
  onRemoveBlock,
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
        blocks={blocks}
        block={block}
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
