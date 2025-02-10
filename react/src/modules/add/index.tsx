import React, { useRef, useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import ContextualMenu from "../../components/menus/ContextualMenu";
import {
  AVAILABLE_BLOCKS,
  BLOCKS_SETTINGS,
} from "@typeblox/core/dist/constants";
import { BlockType } from "@typeblox/core/dist/types";
import Tooltip from "../../components/Tooltip";

interface AddProps {
  setShowToolbar: Function;
  blockId: string;
  isToolbar?: boolean;
}

export const Add: React.FC<AddProps> = ({
  setShowToolbar,
  blockId,
  isToolbar = false,
}) => {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const { editor } = useTypebloxEditor();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Tooltip content="Add block">
        <button
          ref={buttonRef}
          onClick={() => {
            setShowPlusMenu(!showPlusMenu);
            if (!isToolbar) setShowToolbar(false);
          }}
          className={`border-0 rounded hover:bg-gray-100 flex items-center justify-center ${
            showPlusMenu ? "bg-gray-300 text-white" : ""
          }`}
        >
          <Icon name="Plus" color="black" />
        </button>
      </Tooltip>

      <ContextualMenu
        referenceElement={buttonRef.current}
        isVisible={showPlusMenu}
        sectionName="Add new block"
        options={AVAILABLE_BLOCKS.map((item: BlockType) => {
          return {
            label: BLOCKS_SETTINGS[item].visibleName,
            description: BLOCKS_SETTINGS[item].description,
            onClick: () => {
              editor.blox().addBlockAfter(blockId, item);
            },
            icon: BLOCKS_SETTINGS[item].icon,
          };
        })}
        onClose={() => setShowPlusMenu(false)}
      />
    </>
  );
};
