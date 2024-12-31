import { BlockType } from ".core/types";
import React, { FC } from "react";
import { useState } from "react";
import ContextualMenu from "./ContextualMenu";
import Icon from "./Icon";

interface BlockMenuProps {
  blockId: string;
  onAddBelow: (blockId: string, type: BlockType) => void;
  onRemove: (blockId: string) => void;
  dragListeners?: any;
}

const BlockMenu: FC<BlockMenuProps> = ({
  blockId,
  onAddBelow,
  onRemove,
  dragListeners,
}) => {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showDragMenu, setShowDragMenu] = useState(false);

  return (
    <>
      <div
        className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity absolute"
        style={{ left: "-55px", top: "10px" }}
      >
        <button
          onClick={() => setShowPlusMenu(!showPlusMenu)}
          className="w-6 h-6 flex items-center justify-center border border-0 rounded-full bg-white text-gray-700 hover:bg-gray-50"
        >
          <Icon src="/icons/plus.svg" />
        </button>
        <button
          onClick={() => {
            setTimeout(() => setShowDragMenu(!showDragMenu), 100);
          }}
          {...dragListeners}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing border border-0 bg-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <circle cx="5" cy="5" r="1" />
            <circle cx="5" cy="12" r="1" />
            <circle cx="5" cy="19" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      <ContextualMenu
        isVisible={showPlusMenu}
        position={{ top: 40, left: 0 }}
        options={[
          {
            label: "Text",
            onClick: () => onAddBelow(blockId, "text"),
            icon: "icons/align-left.svg",
          },
          {
            label: "Headline 1",
            onClick: () => onAddBelow(blockId, "headline1"),
            icon: "icons/h-1.svg",
          },
          {
            label: "Headline 2",
            onClick: () => onAddBelow(blockId, "headline2"),
            icon: "icons/h-2.svg",
          },
          {
            label: "Headline 3",
            onClick: () => onAddBelow(blockId, "headline3"),
            icon: "icons/h-3.svg",
          },
          {
            label: "Code",
            onClick: () => onAddBelow(blockId, "code"),
            icon: "icons/code.svg",
          },
          {
            label: "Image",
            onClick: () => onAddBelow(blockId, "image"),
            icon: "icons/photo.svg",
          },
        ]}
        onClose={() => setShowPlusMenu(false)}
      />

      <ContextualMenu
        isVisible={showDragMenu}
        position={{ top: 40, left: 20 }}
        options={[
          {
            label: "Remove Block",
            onClick: () => onRemove(blockId),
            icon: "icons/trash.svg",
          },
        ]}
        onClose={() => setShowDragMenu(false)}
      />
    </>
  );
};

export default BlockMenu;
