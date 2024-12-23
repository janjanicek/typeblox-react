import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import ContextualMenu from "./components/ContextualMenu";
import Icon from "./components/Icon";
import useBlockStore from "./stores/BlockStore";
import { AVAILABLE_FONTS } from "./utils/constants";
import { useFormatting } from "./utils/FormattingContext";

interface ToolbarProps {
  textMenuPosition: { top: number; left: number };
  saveSelection: () => void;
  restoreSelection: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  textMenuPosition,
  saveSelection,
  restoreSelection,
}) => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedBgColor, setSelectedBgColor] = useState("#ffff00");
  const [selectedFont, setSelectedFont] = useState("arial");
  const [showSelectFont, setShowSelectFont] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikeout, setIsStrikeout] = useState<boolean>(false);

  const { applyFormatting, unapplyFormatting, detectStyle } = useFormatting();
  const { detectedStyles, setDetectedStyles } = useBlockStore();

  // Update color pickers when the detected style changes
  useEffect(() => {
    console.log(detectedStyles);

    if (detectedStyles.color) setSelectedColor(detectedStyles.color);
    if (detectedStyles.backgroundColor)
      setSelectedBgColor(detectedStyles.backgroundColor);
    if (
      detectedStyles.fontFamily &&
      detectedStyles.fontFamily.indexOf("sans-serif") === -1
    ) {
      setSelectedFont(detectedStyles.fontFamily);
    } else {
      setSelectedFont("arial");
    }

    // Update other detected styles (e.g., bold, italic, underline, strikeout)
    setIsBold(detectedStyles.isBold);
    setIsItalic(detectedStyles.isItalic);
    setIsUnderline(detectedStyles.isUnderline);
    setIsStrikeout(detectedStyles.isStrikeout);
  }, [detectedStyles]);

  const handleColorChange = (color: string) => {
    restoreSelection(); // Restore the saved selection
    setSelectedColor(color);
    applyFormatting("span", { color }); // Apply text color immediately
  };

  const handleBgColorChange = (color: string) => {
    restoreSelection(); // Restore the saved selection
    setSelectedBgColor(color);
    applyFormatting("mark", { backgroundColor: color, color: "inherit" }); // Apply background color immediately
  };

  const handleFontChange = (font: string) => {
    restoreSelection(); // Restore the saved selection
    setSelectedFont(font);
    console.log(selectedFont);
    applyFormatting("span", { fontFamily: font }); // Apply background color immediately
  };

  const toggleTextColorPicker = () => {
    saveSelection(); // Save the current selection before opening the color picker
    setShowTextColorPicker(!showTextColorPicker);
  };

  const toggleFontSelectionPicker = () => {
    saveSelection(); // Save the current selection before opening the color picker
    setShowSelectFont(!showSelectFont);
  };

  const toggleBgColorPicker = () => {
    saveSelection(); // Save the current selection before opening the color picker
    setShowBgColorPicker(!showBgColorPicker);
  };

  const fontOptions = AVAILABLE_FONTS.map((font: string) => ({
    label: font,
    onClick: () => handleFontChange(font.toLowerCase()),
    style: { fontFamily: font },
  }));

  return (
    <div
      className="menu-container flex gap-1 absolute bg-white border border-gray-300 shadow-lg rounded p-2"
      style={{
        top: `${textMenuPosition.top}px`,
        left: `${textMenuPosition.left}px`,
        transform: "translate(-50%, -100%)",
        zIndex: 100,
        whiteSpace: "nowrap",
      }}
    >
      {/* Formatting Buttons */}
      <button
        className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
          isBold ? "bg-gray-300 text-white" : ""
        }`}
        onClick={() => {
          !isBold ? applyFormatting("b") : unapplyFormatting("b");
          setDetectedStyles(detectStyle());
        }}
      >
        <Icon src="/icons/bold.svg" />
      </button>
      <button
        className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
          isItalic ? "bg-gray-300 text-white" : ""
        }`}
        onClick={() => {
          !isItalic ? applyFormatting("i") : unapplyFormatting("i");
          setDetectedStyles(detectStyle());
        }}
      >
        <Icon src="/icons/italic.svg" />
      </button>
      <button
        className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
          isUnderline ? "bg-gray-300 text-white" : ""
        }`}
        onClick={() => {
          !isUnderline ? applyFormatting("u") : unapplyFormatting("u");
          setDetectedStyles(detectStyle());
        }}
      >
        <Icon src="/icons/underline.svg" />
      </button>
      <button
        className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
          isStrikeout ? "bg-gray-300 text-white" : ""
        }`}
        onClick={() => {
          !isStrikeout ? applyFormatting("s") : unapplyFormatting("s");
          setDetectedStyles(detectStyle());
        }}
      >
        <Icon src="/icons/strikethrough.svg" />
      </button>

      {/* Font Size */}
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

      {/* Text Color Picker */}
      <button
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        onClick={toggleTextColorPicker}
      >
        <Icon src="/icons/palette.svg" />
      </button>
      {showTextColorPicker && (
        <div className="absolute mt-5 z-10" style={{ top: 30, left: 250 }}>
          <HexColorPicker color={selectedColor} onChange={handleColorChange} />
          <div className="mt-1 text-xs text-gray-500">
            Selected: {selectedColor}
          </div>
        </div>
      )}

      {/* Background Color Picker */}
      <button
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        onClick={toggleBgColorPicker}
      >
        <Icon src="/icons/highlight.svg" />
      </button>
      {showBgColorPicker && (
        <div className="absolute mt-5 z-10" style={{ top: 30, left: 300 }}>
          <HexColorPicker
            color={selectedBgColor}
            onChange={handleBgColorChange}
          />
          <div className="mt-1 text-xs text-gray-500">
            Selected: {selectedBgColor}
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
