import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import BlockRow from "./BlockRow";
import { Block, BlockType } from "./utils/types";
import { FormattingProvider } from "./utils/FormattingContext";

interface SortableItemProps {
  block: Block;
  onUpdateBlock: (blockId: string, content: string) => void;
  onAddBlockBelow: (blockId: string, type: BlockType) => void;
  onRemoveBlock: (blockId: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  block,
  onUpdateBlock,
  onAddBlockBelow,
  onRemoveBlock,
}) => {
  const { id, type, content } = block;

  // Create a RefObject specifically for HTMLElement
  const contentRef = useRef<HTMLElement>(null!); // Use a non-null assertion (!)

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
