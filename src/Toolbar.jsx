import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

function Toolbar({ textMenuPosition, applyFormatting, detectStyle, saveSelection, restoreSelection }) {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedBgColor, setSelectedBgColor] = useState("#ffff00");
  const [selectedFont, setSelectedFont] = useState("arial");
  const [showSelectFont, setShowSelectFont] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  // Update color pickers when the detected style changes
  useEffect(() => {
    const { color, backgroundColor } = detectStyle();
    if (color) setSelectedColor(color);
    if (backgroundColor) setSelectedBgColor(backgroundColor);
    if (selectedFont) setSelectedFont(selectedFont);
  }, [detectStyle]);

  const handleColorChange = (color) => {
    restoreSelection(); // Restore the saved selection
    setSelectedColor(color);
    applyFormatting("span", { color }, "selection"); // Apply text color immediately
  };

  const handleBgColorChange = (color) => {
    restoreSelection(); // Restore the saved selection
    setSelectedBgColor(color);
    applyFormatting("mark", { backgroundColor: color, color: 'inherit' },  "selection"); // Apply background color immediately
  };

  const handleFontChange = (font) => {
    restoreSelection(); // Restore the saved selection
    setSelectedFont(font);
    applyFormatting("span", { fontFamily: font},  "selection"); // Apply background color immediately
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
      className="menu-container absolute bg-white border border-gray-300 shadow-lg rounded p-2"
      style={{
        top: `${textMenuPosition.top}px`,
        left: `${textMenuPosition.left}px`,
        transform: "translate(-50%, -100%)",
        zIndex: 100,
        whiteSpace: 'nowrap'
      }}
    >
      {/* Formatting Buttons */}
      <button
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        onClick={() => applyFormatting("b")}
      >
        <strong>B</strong>
      </button>
      <button
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        onClick={() => applyFormatting("i")}
      >
        <em>I</em>
      </button>
      <button
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        onClick={() => applyFormatting("u")}
      >
        <u>U</u>
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
            handleFontChange('arial');
          }}
          className="block"
          style={{fontFamily: 'arial'}}>
            Arial
            </p>
            <p
          onClick={() => {
            setShowSelectFont(false);
            handleFontChange('courier');
          }}
          style={{fontFamily: 'courier'}}
          className="block">
            Courier
            </p>

            <p
          onClick={() => {
            setShowSelectFont(false);
            handleFontChange('times new roman');
          }}
          style={{fontFamily: 'times new roman'}}
          className="block">
            Times New Roman
            </p>
            </div>
        )}

      {/* Text Color Picker */}
        <button
          className="px-2 py-1 border-0 rounded hover:bg-gray-100"
          onClick={toggleTextColorPicker}
        >
          Text Color
        </button>
        {showTextColorPicker && (
          <div className="absolute mt-2 z-10">
            <HexColorPicker
              color={selectedColor}
              onChange={handleColorChange}
            />
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
          Background Color
        </button>
        {showBgColorPicker && (
          <div className="absolute mt-2 z-10">
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
}

export default Toolbar;
