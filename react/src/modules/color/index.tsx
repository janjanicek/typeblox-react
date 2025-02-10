import Icon from "../../components/Icon";
import React from "react";
import useBlockStore from "../../stores/BlockStore";
import { useTypebloxEditor } from "../../context/EditorContext";
import Tooltip from "../../components/Tooltip";

export const Color: React.FC = () => {
  const { selectedColor, setSelectedColor } = useBlockStore();
  const { editor } = useTypebloxEditor();

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    editor.blox().getCurrentBlock()?.applyStyle("span", { color });
  };

  return (
    <Tooltip content={`Text color`}>
      <button className="px-2 py-1 border-0 rounded hover:bg-gray-100 flex items-center">
        <Icon name="LetterA" />
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          style={{ width: "24px", border: 0, background: "none" }}
        />
      </button>
    </Tooltip>
  );
};
