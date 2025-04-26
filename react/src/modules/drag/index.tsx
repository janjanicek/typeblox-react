import React, { useRef, useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import ContextualMenu from "../../components/menus/ContextualMenu";
import Tooltip from "../../components/Tooltip";
import { useToolbar } from "../../context/ToolbarContext";

interface DragProps {
  setIsBlockSelected: Function;
  blockId: string;
  dragListeners?: any;
  isToolbar?: boolean;
}

export const Drag: React.FC<DragProps> = ({
  setIsBlockSelected,
  blockId,
  dragListeners,
  isToolbar = false,
}) => {
  const [showDragMenu, setShowDragMenu] = useState(false);
  const { editor } = useTypebloxEditor();
  const { hide } = useToolbar();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Tooltip content="Drag block">
        <button
          ref={buttonRef}
          data-test="drag"
          onClick={() => {
            setTimeout(() => {
              if (!isToolbar) hide();
              setShowDragMenu(!showDragMenu);
            }, 100);
          }}
          {...dragListeners}
          className={`border-0 rounded hover:bg-gray-100 flex items-center justify-center ${
            showDragMenu ? "tbx-active" : ""
          }
          ${isToolbar ? " px-2 py-1" : ""}`}
        >
          <Icon name="GripVertical" color="black" />
        </button>
      </Tooltip>

      <ContextualMenu
        referenceElement={buttonRef.current}
        isVisible={showDragMenu}
        options={[
          {
            label: "Move up",
            onClick: () => editor.blox().moveBlockUp(blockId),
            icon: "ArrowUp",
          },
          {
            label: "Move down",
            onClick: () => editor.blox().moveBlockDown(blockId),
            icon: "ArrowDown",
          },
          {
            label: "Remove block",
            onClick: () => editor.blox().removeById(blockId),
            icon: "Trash",
          },
        ]}
        onOpen={() => setIsBlockSelected(true)}
        onClose={() => {
          setIsBlockSelected(false);
          setShowDragMenu(false);
        }}
      />
    </>
  );
};
