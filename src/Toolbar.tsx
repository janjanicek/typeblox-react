import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import Icon from "./components/Icon";

interface ToolbarProps {
  textMenuPosition: { top: number; left: number };
  applyFormatting: (tagName: string, style?: Record<string, string>) => void;
  detectStyle: () => {
    color: string | null;
    backgroundColor: string | null;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikeout: boolean;
    fontFamily: string | null;
  };
  saveSelection: () => void;
  restoreSelection: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  textMenuPosition,
  applyFormatting,
  detectStyle,
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

  // Update color pickers when the detected style changes
  useEffect(() => {
    const styles = detectStyle();

    if (styles.color) setSelectedColor(styles.color);
    if (styles.backgroundColor) setSelectedBgColor(styles.backgroundColor);
    if (styles.fontFamily) setSelectedFont(styles.fontFamily); // Fetch the font from styles

    // Update other detected styles (e.g., bold, italic, underline, strikeout)
    setIsBold(styles.isBold);
    setIsItalic(styles.isItalic);
    setIsUnderline(styles.isUnderline);
    setIsStrikeout(styles.isStrikeout);
  }, []);

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

  return (
    <div
      className="menu-container flex absolute bg-white border border-gray-300 shadow-lg rounded p-2"
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
          isBold ? "bg-gray-700 text-white" : ""
        }`}
        onClick={() => applyFormatting("b")}
      >
        <Icon src="/icons/bold.svg" />
      </button>
      <button
        className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
          isItalic ? "bg-gray-700 text-white" : ""
        }`}
        onClick={() => applyFormatting("i")}
      >
        <Icon src="/icons/italic.svg" />
      </button>
      <button
        className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
          isUnderline ? "bg-gray-700 text-white" : ""
        }`}
        onClick={() => applyFormatting("u")}
      >
        <Icon src="/icons/underline.svg" />
      </button>

      {/* Font Size */}
      <button
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        onClick={toggleFontSelectionPicker}
      >
        Font
      </button>
      {showSelectFont && (
        <div className="absolute left-10 top-0 bg-white border border-gray-300 shadow-lg p-2 z-10">
          <p
            onClick={() => {
              setShowSelectFont(false);
              handleFontChange("arial");
            }}
            className="block"
            style={{ fontFamily: "arial" }}
          >
            Arial
          </p>
          <p
            onClick={() => {
              setShowSelectFont(false);
              handleFontChange("courier");
            }}
            style={{ fontFamily: "courier" }}
            className="block"
          >
            Courier
          </p>

          <p
            onClick={() => {
              setShowSelectFont(false);
              handleFontChange("times new roman");
            }}
            style={{ fontFamily: "times new roman" }}
            className="block"
          >
            Times New Roman
          </p>
        </div>
      )}

      {/* Text Color Picker */}
      <button
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        onClick={toggleTextColorPicker}
      >
        <Icon src="/icons/palette.svg" />
      </button>
      {showTextColorPicker && (
        <div className="absolute mt-5 z-10">
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
        <div className="absolute mt-5 z-10">
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
