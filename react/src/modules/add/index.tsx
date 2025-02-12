import React, { ReactNode, useRef, useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import ContextualMenu from "../../components/menus/ContextualMenu";
import {
  getAvailableBlocks,
  getBlockSettings,
} from "@typeblox/core/dist/blockTypes";
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
  const blockSettings = getBlockSettings();

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
            showPlusMenu ? "tbx-active" : ""
          }
          ${isToolbar ? " px-2 py-1" : ""}`}
        >
          <Icon name="Plus" color="black" />
        </button>
      </Tooltip>

      <ContextualMenu
        referenceElement={buttonRef.current}
        isVisible={showPlusMenu}
        sectionName="Add new block"
        options={getAvailableBlocks().map((item: BlockType) => {
          return {
            label: blockSettings[item]?.visibleName,
            description: blockSettings[item]?.description,
            onClick: () => {
              editor.blox().addBlockAfter(blockId, item);
            },
            icon: blockSettings[item]?.icon,
            iconElement: blockSettings[item]?.iconElement as ReactNode,
          };
        })}
        onClose={() => setShowPlusMenu(false)}
      />
    </>
  );
};
