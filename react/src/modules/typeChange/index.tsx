import React from "react";
import ContextualMenu from "../../components/ContextualMenu";
import useBlockStore from "../../stores/BlockStore";
import { BLOCKS_SETTINGS } from "@typeblox/core/dist/constants";
import { BlockType } from "@typeblox/core/dist/types";
import Icon from "../../components/Icon";
import type { Blox } from "@typeblox/core/dist/classes/Blox";

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
  const handleBlockTypeChange = (newType: BlockType) => {
    onUpdate({
      id: block.id,
      type: newType,
    });
  };

  const toggleBlockSelection = () => {
    setShowTypeSelection(!showTypeSelection);
  };

  return (
    <>
      <button
        className="px-2 py-1 border-0 rounded hover:bg-gray-100 flex"
        onClick={toggleBlockSelection}
      >
        <span className="mr-2">
          <Icon name={BLOCKS_SETTINGS[block.type].icon} />
        </span>
        {BLOCKS_SETTINGS[block.type].visibleName}
      </button>

      <ContextualMenu
        isVisible={showTypeSelection}
        sectionName="Turn into"
        position={{ top: 50, left: 0 }}
        options={(
          BLOCKS_SETTINGS[block.type].availableTypes as BlockType[]
        ).map((item) => {
          return {
            label: BLOCKS_SETTINGS[item].visibleName,
            description: BLOCKS_SETTINGS[item].description,
            onClick: () => {
              handleBlockTypeChange(item);
            },
            icon: BLOCKS_SETTINGS[item].icon,
          };
        })}
        onClose={() => setShowTypeSelection(false)}
      />
    </>
  );
};
