import React, { useRef } from "react";
import ContextualMenu from "../../components/menus/ContextualMenu";
import useBlockStore from "../../stores/BlockStore";
import { AVAILABLE_FONTS } from "@typeblox/core/dist/constants";
import { useTypebloxEditor } from "../../context/EditorContext";
import Tooltip from "../../components/Tooltip";

export const Font: React.FC = () => {
  const { showSelectFont, setShowSelectFont } = useBlockStore();
  const { editor } = useTypebloxEditor();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleFontChange = (font: string) => {
    // setSelectedFont(font);
    editor.blox().getCurrentBlock()?.applyStyle("span", { fontFamily: font });
  };

  const fontOptions = AVAILABLE_FONTS.map((font: string) => ({
    label: font,
    onClick: () => handleFontChange(font.toLowerCase()),
    style: { fontFamily: font },
  }));

  const toggleFontSelectionPicker = () => {
    setShowSelectFont(!showSelectFont);
  };

  const selectedFont = editor.getStyle("fontFamily") ?? "Arial";

  return (
    <div className="relative flex items-stretch">
      <Tooltip content={`Font ${selectedFont}`}>
        <button
          ref={buttonRef}
          className="px-2 py-1 border-0 rounded hover:bg-gray-100"
          onClick={toggleFontSelectionPicker}
        >
          <span style={{ textTransform: "capitalize" }}>{selectedFont}</span>
        </button>
      </Tooltip>
      <ContextualMenu
        referenceElement={buttonRef.current}
        isVisible={showSelectFont}
        options={fontOptions}
        onClose={() => setShowSelectFont(false)}
        selectedValue={editor.getStyle("fontFamily")}
      />
    </div>
  );
};
