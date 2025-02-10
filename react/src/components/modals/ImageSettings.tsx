import { Blox } from "@typeblox/core/dist/classes/Blox";
import React, { useState } from "react";

interface ImageSettingsMenuProps {
  block: Blox;
  onClose: Function;
}

const ImageSettingsMenu: React.FC<ImageSettingsMenuProps> = ({
  onClose,
  block,
}) => {

  const getParsedValue = (value: string | undefined) => {
    return value && value !== "auto" ? value : ""; // Return empty string if value is empty or 'auto'
  };

  const [height, setLocalHeight] = useState(getParsedValue(block.getStyles().height));
  const [width, setLocalWidth] = useState(getParsedValue(block.getStyles().width));
  const [alt, setLocalAlt] = useState(block.getAttributes().alt);

  const handleDimensionChange = (width: string, height: string) => {
    block.setStyles({
      width: width ? `${width}px` : "auto",
      height: height ? `${height}px` : "auto",
    });
    block.setAttribute("alt", alt);
  };

  const handleSave = () => {
    handleDimensionChange(width, height);
    onClose();
  };

  const parseOrEmpty = (value: string) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? "" : parsed.toString(); // Return empty string if NaN
  };

  return (
    <div>
      <div className="flex">
        <label className="block mb-2">
          Width (px):
          <input
            type="number"
            value={parseOrEmpty(width)}
            onChange={(e) => setLocalWidth(e.target.value)}
            placeholder="auto"
            className="border p-2 rounded-md w-full"
          />
        </label>

        {/* Height Input */}
        <label className="block mb-2">
          Height (px):
          <input
            type="number"
            value={parseOrEmpty(height)}
            onChange={(e) => setLocalHeight(e.target.value)}
            placeholder="auto"
            className="border p-2 rounded-md w-full"
          />
        </label>
      </div>
      <div>
        <label className="block mb-2">
          Alt text:
          <input
            type="text"
            value={alt}
            onChange={(e) => setLocalAlt(e.target.value)}
            placeholder="Enter alternative text"
            className="border p-2 w-full rounded-md"
          />
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="tbx-bg-primary text-white px-4 py-2 rounded mt-4"
      >
        Save
      </button>
    </div>
  );
};

export default ImageSettingsMenu;
