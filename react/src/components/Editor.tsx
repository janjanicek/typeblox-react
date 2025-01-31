// Editor.jsx
import React, { useCallback, useEffect, useState } from "react";
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
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import { BlockType, Extension } from "@typeblox/core/dist/types";
import useEditorStore from "../stores/EditorStore";
import "../styles/editor.scss";
import {
  BLOCK_TYPES,
  DEFAULT_TOOLBARS,
  EVENTS,
} from "@typeblox/core/dist/constants";
import { useTypebloxEditor } from "../context/EditorContext";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import { DEFAULT_MENUS } from "../utils/constants";

interface EditorProps {
  toolbars?: Partial<Record<BlockType, string>>;
  menus?: Partial<Record<string, Array<string>>>;
  extensions?: Extension[];
  height?: number;
}

const Editor: React.FC<EditorProps> = ({
  toolbars = DEFAULT_TOOLBARS,
  menus = DEFAULT_MENUS,
}) => {
  const { editor, onChange, onImageUpload } = useTypebloxEditor();

  const [blocks, setBlocks] = useState<Blox[]>(editor.blox().getBlox());
  const { setToolbarSettings, setMenuSettings } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  // const { isAllSelected, setIsAllSelected } = useEditorStore();

  // Debounce timeout
  let debounceTimeout: NodeJS.Timeout;

  // Handle content updates with debounce
  const updateContent = useCallback(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      editor.blox().update(onChange, blocks);
    }, 300);
  }, [editor, onChange, blocks]);

  // Update content whenever blocks change
  useEffect(() => {
    updateContent();
    return () => clearTimeout(debounceTimeout);
  }, [blocks, updateContent]);

  useEffect(() => {
    const handleBlocksChange = (newBlocks: Blox[]) => {
      // Update the blocks state directly
      setBlocks(newBlocks);
    };

    const handleStyleChange = (updatedBlock: Blox): void => {
      if (!updatedBlock) return;
      // Update the blocks state to reflect the style change
      setBlocks((prevBlocks) =>
        prevBlocks.map((block) => {
          if (block.id === updatedBlock.id) {
            return Object.assign(new Blox(block), {
              styles: updatedBlock.styles,
            });
          }
          return block;
        }),
      );
    };

    editor.on(EVENTS.blocksChanged, handleBlocksChange);
    editor.on(EVENTS.styleChange, handleStyleChange);
    return () => {
      editor.off(EVENTS.blocksChanged, handleBlocksChange);
      editor.off(EVENTS.styleChange, handleStyleChange);
    };
  }, [editor]);

  useEffect(() => {
    if (!toolbars || typeof toolbars !== "object") return;

    const mergedToolbars = {
      ...DEFAULT_TOOLBARS,
      ...toolbars,
    };

    const mergedMenus = {
      ...DEFAULT_MENUS,
      ...menus,
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

    Object.entries(mergedMenus).forEach(([menuName, modules]) => {
      setMenuSettings(menuName, modules ?? []);
    });
  }, [toolbars, setToolbarSettings, menus, setMenuSettings]);

  // Handle drag-and-drop reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) {
      return;
    }

    // const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    editor.blox().moveBlock(active.id, newIndex);
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
      setOverId(activeId);
      return;
    }

    const activeIndex = blocks.findIndex((block) => block.id === activeId);
    const overIndex = blocks.findIndex((block) => block.id === overId);

    if (activeIndex > overIndex) {
      // Move up if above half height
      setOverId(overId);
    } else {
      // Move down if below half height
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
    const currentBlock = editor.blox().getBlockById(update.id);

    if (!currentBlock) return;

    console.log("handleUpdateBlock", update.content);
    if(update.content?.includes('class="typeblox-selected"')) return;

    if (update.content && update.content !== currentBlock.content) currentBlock.content = update.content;
    if (update.type && update.type !== currentBlock.type) currentBlock?.toggleType(update.type);
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);

  return (
    <div id="typeblox-editor">
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
              isOver={block.id === overId}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeId &&
            (() => {
              const activeBlock = blocks.find((item) => item.id === activeId);

              return activeBlock ? (
                <div
                  style={{
                    height: "50px",
                    maxWidth:
                      activeBlock.type === BLOCK_TYPES.image ? "50%" : "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <SortableItem
                    key={activeBlock.id}
                    block={activeBlock}
                    onUpdateBlock={handleUpdateBlock}
                    isDragging={true}
                  />
                </div>
              ) : null;
            })()}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Editor;
