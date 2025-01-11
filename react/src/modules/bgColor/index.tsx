import React from "react";
import useBlockStore from "../../stores/BlockStore";
import { useEditor } from "../../utils/EditorContext";
import Icon from "../../components/Icon";

export const BgColor: React.FC = () => {
  const { selectedBgColor, setSelectedBgColor } = useBlockStore();
  const { editor } = useEditor();

  const handleBgColorChange = (color: string) => {
    setSelectedBgColor(color);
    editor
      .getCurrentBlock()
      ?.applyStyle("mark", { backgroundColor: color, color: "inherit" });
  };

  return (
    <button className="px-2 py-1 border-0 rounded hover:bg-gray-100 flex">
      <Icon name="highlight" />
      <input
        type="color"
        value={selectedBgColor}
        onChange={(e) => handleBgColorChange(e.target.value)}
        style={{ width: "24px", border: 0, background: "none" }}
      />
    </button>
  );
};
