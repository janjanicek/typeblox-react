import React, { useRef } from "react";
import ContextualMenu from "../../components/menus/ContextualMenu";
import useBlockStore from "../../stores/BlockStore";
import { BLOCKS_SETTINGS } from "@typeblox/core/dist/blockTypes";
import { BlockType } from "@typeblox/core/dist/types";
import Icon from "../../components/Icon";
import type { Blox } from "@typeblox/core/dist/classes/Blox";
import Tooltip from "../../components/Tooltip";

interface TypeChangeProps {
  block: Blox;
  onUpdate: (update: {
    id: string;
    content?: string;
    type?: BlockType;
  }) => void;
}

export const TypeChange: React.FC<TypeChangeProps> = ({ block, onUpdate }) => {
  const { showTypeSelection, setShowTypeSelection } = useBlockStore();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleBlockTypeChange = (newType: BlockType) => {
    onUpdate({
      id: block.id,
      type: newType,
    });
  };

  const toggleBlockSelection = () => {
    if (BLOCKS_SETTINGS[block.type].availableTypes.length === 0) return;
    setShowTypeSelection(!showTypeSelection);
  };

  return (
    <>
      <Tooltip
        content={`Block type ${BLOCKS_SETTINGS[block.type].visibleName}`}
      >
        <button
          ref={buttonRef}
          className="px-2 py-1 border-0 rounded hover:bg-gray-100 flex items-center"
          onClick={toggleBlockSelection}
          data-test="type"
        >
          {typeof BLOCKS_SETTINGS[block.type].icon === "string" && (
            <span className="mr-2">
              <Icon name={BLOCKS_SETTINGS[block.type].icon as string} />
            </span>
          )}
          {BLOCKS_SETTINGS[block.type].visibleName}
        </button>
      </Tooltip>

      <ContextualMenu
        referenceElement={buttonRef.current}
        isVisible={showTypeSelection}
        sectionName="Turn into"
        options={(
          BLOCKS_SETTINGS[block.type].availableTypes as BlockType[]
        ).map((item) => {
          return {
            label: BLOCKS_SETTINGS[item]?.visibleName,
            description: BLOCKS_SETTINGS[item]?.description,
            onClick: () => {
              handleBlockTypeChange(item);
            },
            icon: BLOCKS_SETTINGS[item]?.icon,
          };
        })}
        onClose={() => setShowTypeSelection(false)}
      />
    </>
  );
};
