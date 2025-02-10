// Editor.jsx
import React, { useCallback, useEffect, useState, useReducer, useRef } from "react";
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
  className?: string;
}

type BlockAction =
  | { type: 'SET_BLOCKS'; payload: Blox[] }
  | { type: 'UPDATE_STYLE'; payload: Blox };


  const blockReducer = (state: Blox[], action: BlockAction): Blox[] => {
    switch (action.type) {
      case 'SET_BLOCKS':
        return action.payload;
      case 'UPDATE_STYLE':
        return state.map(block =>
          block.id === action.payload.id
            ? Object.assign(new Blox(block), {
              styles: action.payload.styles,
              content: action.payload.content,
              classes: action.payload.classes,
              attributes: action.payload.attributes
            })
            : block
        );
      default:
        return state;
    }
  };

const Editor: React.FC<EditorProps> = ({
  toolbars = DEFAULT_TOOLBARS,
  menus = DEFAULT_MENUS,
  className,
}) => {
  const { editor, onChange } = useTypebloxEditor();
  const [blocks, dispatch] = useReducer(blockReducer, [], () => editor.blox()?.getBlox() ?? []);
  const { setToolbarSettings, setMenuSettings } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  let debounceTimeout: NodeJS.Timeout;

  // Handle content updates with debounce
  const updateContent = useCallback(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      editor.blox().update({onChange, blocks});
    }, 300);
  }, [editor, onChange, blocks]);

  // Update content whenever blocks change
  useEffect(() => {
    updateContent();
    return () => clearTimeout(debounceTimeout);
  }, [blocks, updateContent]);

  const handleBlocksChange = (newBlocks: Blox[]) => {
    dispatch({ type: 'SET_BLOCKS', payload: newBlocks });
  };

  const handleStyleChange = (updatedBlock: Blox): void => {
    if (!updatedBlock) return;
    dispatch({ type: 'UPDATE_STYLE', payload: updatedBlock });
  };

  useEffect(() => {
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
    if (update.content?.includes('class="typeblox-selected"')) return;
    if (update.content && update.content !== currentBlock.content)
      currentBlock.setContent(update.content);

    if (update.type && update.type !== currentBlock.type)
      currentBlock?.toggleType(update.type);
    onChange(editor.elements().getCurrentDOM());
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);

  return (
    <div className="tbx-editor-container"><div id="typeblox-editor" className={className}>
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
    </div></div>
  );
};

export default Editor;
