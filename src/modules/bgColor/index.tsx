import React from "react";
import Icon from "../../components/Icon";
import useBlockStore from "../../stores/BlockStore";
import { useFormatting } from "../../utils/FormattingContext";

export const BgColor: React.FC = () => {
  const { selectedBgColor, setSelectedBgColor } = useBlockStore();
  const { applyFormatting } = useFormatting();

  const handleBgColorChange = (color: string) => {
    setSelectedBgColor(color);
    applyFormatting("mark", { backgroundColor: color, color: "inherit" });
  };

  return (
    <button className="px-2 py-1 border-0 rounded hover:bg-gray-100 flex">
      <Icon src="/icons/highlight.svg" />
      <input
        type="color"
        value={selectedBgColor}
        onChange={(e) => handleBgColorChange(e.target.value)}
        style={{ width: "24px", border: 0, background: "none" }}
      />
    </button>
  );
};
