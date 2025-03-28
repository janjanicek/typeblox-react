import { Blox } from "@typeblox/core/dist/classes/Blox";
import React, { useState } from "react";

interface VideoSettingsMenu {
  block: Blox;
  onClose: Function;
}

const VideoSettingsMenu: React.FC<VideoSettingsMenu> = ({ onClose, block }) => {
  const getParsedValue = (value: string | undefined) => {
    return value && value !== "auto" ? value : ""; // Return empty string if value is empty or 'auto'
  };

  const [height, setLocalHeight] = useState(
    getParsedValue(block.getAttributes().height),
  );
  const [width, setLocalWidth] = useState(
    getParsedValue(block.getAttributes().width),
  );
  const [title, setTitle] = useState(block.getAttributes().title);

  const handleDimensionChange = (width: string, height: string) => {
    block.setAttributes({
      width: width ? `${width}` : "",
      height: height ? `${height}` : "",
    });
    if (title) block.setAttribute("alt", title);
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
          Title text:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

export default VideoSettingsMenu;
