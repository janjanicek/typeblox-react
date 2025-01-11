import React from "react";
import ContextualMenu from "../../components/ContextualMenu";
import useBlockStore from "../../stores/BlockStore";
import { AVAILABLE_FONTS } from "@typeblox/core/dist/constants";
import { useEditor } from "../../utils/EditorContext";

export const Font: React.FC = () => {
  const { showSelectFont, setShowSelectFont } = useBlockStore();
  const { editor } = useEditor();

  const handleFontChange = (font: string) => {
    // setSelectedFont(font);
    editor.getCurrentBlock()?.applyStyle("span", { fontFamily: font });
  };

  const fontOptions = AVAILABLE_FONTS.map((font: string) => ({
    label: font,
    onClick: () => handleFontChange(font.toLowerCase()),
    style: { fontFamily: font },
  }));

  const toggleFontSelectionPicker = () => {
    setShowSelectFont(!showSelectFont);
  };

  return (
    <div className="relative">
      <button
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        onClick={toggleFontSelectionPicker}
      >
        <span style={{ textTransform: "capitalize" }}>
          {editor.getStyle("fontFamily") ?? "Arial"}
        </span>
      </button>
      <ContextualMenu
        isVisible={showSelectFont}
        position={{ top: 42, left: 0 }}
        options={fontOptions}
        onClose={() => setShowSelectFont(false)}
        selectedValue={editor.getStyle("fontFamily")}
      />
    </div>
  );
};
