import React from "react";
import Icon from "../../components/Icon";
import useBlockStore from "../../stores/BlockStore";
import { useFormatting } from "../../utils/FormattingContext";

export const Color: React.FC = () => {
  const { selectedColor, setSelectedColor } = useBlockStore();
  const { applyFormatting } = useFormatting();

  const handleColorChange = (color: string) => {
    //restoreSelection(); // Restore the saved selection
    setSelectedColor(color);
    applyFormatting("span", { color }); // Apply text color immediately
  };

  return (
    <button className="px-2 py-1 border-0 rounded hover:bg-gray-100 flex">
      <Icon src="/icons/letter-a.svg" />
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => handleColorChange(e.target.value)}
        style={{ width: "24px", border: 0, background: "none" }}
      />
    </button>
  );
};
