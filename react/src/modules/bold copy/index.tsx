import React, { useState, useEffect } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import Tooltip from "../../components/Tooltip";
import { BLOCK_TYPES } from "@typeblox/core/dist/constants";
import { Blox } from "@typeblox/core/dist/classes/Blox";

interface AlignProps {
  block: Blox;
}

export const Align: React.FC<AlignProps> = ({ block }) => {
  const { editor } = useTypebloxEditor();
  const [activeAlignment, setActiveAlignment] = useState<string | null>(null);

  useEffect(() => {
    const currentAlignment =
      block
        .getClasses()
        .find((cls) =>
          ["align-left", "align-center", "align-right"].includes(cls),
        ) ||
      block.getStyles().textAlign ||
      null;
    setActiveAlignment(currentAlignment);
  }, [editor]);

  const toggleAlignment = (alignment: string) => {
    console.log(block.type);

    if (block.type === BLOCK_TYPES.image) {
      block.removeClass(`tbx-align-left`);
      block.removeClass(`tbx-align-center`);
      block.removeClass(`tbx-align-right`);
      block.addClass(`tbx-align-${alignment}`);
    } else {
      // Toggle style for other block types
      block.toggleStyle("text-align", alignment);
    }

    setActiveAlignment(alignment);
  };

  return (
    <div className="flex space-x-2">
      <Tooltip content="Align left">
        <button
          className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
            activeAlignment === "left"
              ? "bg-gray-300 text-white"
              : "hover:bg-gray-100"
          }`}
          onClick={() => toggleAlignment("left")}
        >
          <Icon name="AlignLeft" />
        </button>
      </Tooltip>
      <Tooltip content="Align center">
        <button
          className={`px-2 py-1 border-0 rounded hover:bg-gray-100  ${
            activeAlignment === "center"
              ? "bg-gray-300 text-white"
              : "hover:bg-gray-100"
          }`}
          onClick={() => toggleAlignment("center")}
        >
          <Icon name="AlignCenter" />
        </button>
      </Tooltip>
      <Tooltip content="Align right">
        <button
          className={`px-2 py-1 border-0 rounded hover:bg-gray-100  ${
            activeAlignment === "right"
              ? "bg-gray-300 text-white"
              : "hover:bg-gray-100"
          }`}
          onClick={() => toggleAlignment("right")}
        >
          <Icon name="AlignRight" />
        </button>
      </Tooltip>
    </div>
  );
};
