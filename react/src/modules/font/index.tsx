import React, { useEffect, useRef, useState } from "react";
import ContextualMenu from "../../components/menus/ContextualMenu";
import useBlockStore from "../../stores/BlockStore";
import { AVAILABLE_FONTS } from "@typeblox/core/dist/constants";
import { useTypebloxEditor } from "../../context/EditorContext";
import Tooltip from "../../components/Tooltip";
import useEditorStore from "../../stores/EditorStore";

export const Font: React.FC = () => {
  const { showSelectFont, setShowSelectFont } = useBlockStore();
  const { editor } = useTypebloxEditor();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { currentStyle } = useEditorStore();
  const [selectedFont, setSelectedFont] = useState(currentStyle?.fontFamily);

  const handleFontChange = (font: string) => {
    editor.blox().getCurrentBlock()?.applyStyle("span", { fontFamily: font });
    setSelectedFont(font);
  };

  const fontOptions = AVAILABLE_FONTS.map((font: string) => ({
    label: font,
    onClick: () => handleFontChange(font.toLowerCase()),
    style: { fontFamily: font },
  }));

  const toggleFontSelectionPicker = () => {
    setShowSelectFont(!showSelectFont);
  };

  useEffect(() => {
    setSelectedFont(currentStyle?.fontFamily ?? "Arial");
  }, [currentStyle]);

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
        selectedValue={selectedFont ?? "arial"}
      />
    </div>
  );
};
