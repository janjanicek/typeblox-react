import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import BlockRow from "./BlockRow";
import { Block, BlockType } from "./.core/types";
import { FormattingProvider } from "./utils/FormattingContext";

interface SortableItemProps {
  block: Block;
  onUpdateBlock: (blockId: string, content: string) => void;
  onAddBlockBelow: (blockId: string, type: BlockType) => void;
  onRemoveBlock: (blockId: string) => void;
  isDragging?: boolean;
  isOver?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({
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
      <FormattingProvider blockId={block.id} onUpdate={onUpdateBlock}>
        <BlockRow
          blockId={id}
          type={type}
          content={content}
          dragListeners={listeners}
          onUpdate={onUpdateBlock}
          onAddBelow={onAddBlockBelow}
          onRemove={onRemoveBlock}
        />
      </FormattingProvider>
    </div>
  );
};

export default SortableItem;
