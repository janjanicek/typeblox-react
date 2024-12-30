import React from "react";
import ContextualMenu from "../../components/ContextualMenu";
import useBlockStore from "../../stores/BlockStore";
import { AVAILABLE_FONTS } from "../../.core/constants";
import { useFormatting } from "../../utils/FormattingContext";

export const Font: React.FC = () => {
  const { selectedFont, setSelectedFont, showSelectFont, setShowSelectFont } =
    useBlockStore();
  const { applyFormatting } = useFormatting();

  const handleFontChange = (font: string) => {
    //restoreSelection(); // Restore the saved selection
    setSelectedFont(font);
    applyFormatting("span", { fontFamily: font }); // Apply background color immediately
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
    <>
      <button
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        onClick={toggleFontSelectionPicker}
      >
        <span style={{ textTransform: "capitalize" }}>{selectedFont}</span>
      </button>

      <ContextualMenu
        isVisible={showSelectFont}
        position={{ top: 50, left: 200 }}
        options={fontOptions}
        onClose={() => setShowSelectFont(false)}
      />
    </>
  );
};
