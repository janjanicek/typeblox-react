import React, { useRef, useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import ContextualMenu from "../../components/ContextualMenu";
import Tooltip from "../../components/Tooltip";

interface DragProps {
  setShowToolbar: Function;
  setIsBlockSelected: Function;
  blockId: string;
  dragListeners?: any;
  isToolbar?: boolean;
}

export const Drag: React.FC<DragProps> = ({
  setIsBlockSelected,
  setShowToolbar,
  blockId,
  dragListeners,
  isToolbar = false,
}) => {
  const [showDragMenu, setShowDragMenu] = useState(false);
  const { editor } = useTypebloxEditor();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Tooltip content="Drag block">
        <button
          ref={buttonRef}
          onClick={() => {
            setTimeout(() => {
              if (!isToolbar) setShowToolbar(false);
              setShowDragMenu(!showDragMenu);
            }, 100);
          }}
          {...dragListeners}
          className={`border-0 rounded hover:bg-gray-100 ${
            showDragMenu ? "bg-gray-300 text-white" : ""
          } ${
            isToolbar
              ? "px-2 py-1 flex items-center justify-center bg-white text-gray-700 hover:bg-gray-50"
              : "v-6 h-6"
          }`}
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
