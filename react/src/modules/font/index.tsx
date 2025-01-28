import React, { useRef } from "react";
import ContextualMenu from "../../components/ContextualMenu";
import useBlockStore from "../../stores/BlockStore";
import { AVAILABLE_FONTS } from "@typeblox/core/dist/constants";
import { useTypebloxEditor } from "../../context/EditorContext";

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

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        onClick={toggleFontSelectionPicker}
      >
        <span style={{ textTransform: "capitalize" }}>
          {editor.getStyle("fontFamily") ?? "Arial"}
        </span>
      </button>
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
