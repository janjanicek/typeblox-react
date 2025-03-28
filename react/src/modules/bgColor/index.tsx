import React, { useEffect } from "react";
import useBlockStore from "../../stores/BlockStore";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import Tooltip from "../../components/Tooltip";
import useEditorStore from "../../stores/EditorStore";
import { rgbToHex } from "@typeblox/core/dist/utils/colors";

export const BgColor: React.FC = () => {
  const { selectedBgColor, setSelectedBgColor } = useBlockStore();
  const { currentStyle } = useEditorStore();
  const { editor } = useTypebloxEditor();

  const handleBgColorChange = (color: string) => {
    setSelectedBgColor(color);
    editor
      .blox()
      .getCurrentBlock()
      ?.applyStyle("mark", { backgroundColor: color, color: "inherit" });
  };

  useEffect(() => {
    if (currentStyle?.backgroundColor)
      setSelectedBgColor(rgbToHex(currentStyle?.backgroundColor));
  }, [currentStyle]);

  return (
    <Tooltip content={`Background color`}>
      <button className="px-2 py-1 border-0 rounded hover:bg-gray-100 flex items-center">
        <Icon name="Highlight" />
        <input
          type="color"
          value={selectedBgColor}
          onChange={(e) => handleBgColorChange(e.target.value)}
          style={{ width: "24px", border: 0, background: "none" }}
        />
      </button>
    </Tooltip>
  );
};
