import React, { useState } from "react";

interface UploadMenuProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlSubmit: (url: string) => void;
}

const UploadMenu: React.FC<UploadMenuProps> = ({ onChange, onUrlSubmit }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [imageUrl, setImageUrl] = useState("");

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onUrlSubmit(imageUrl);
      setImageUrl(""); // Clear input after submission
    }
  };

  return (
    <div className="rounded-md">
      <div className="flex mb-4">
        <button
          className={`px-3 py-1 ${
            activeTab === "upload" ? "tbx-tabs tbx-active" : ""
          }`}
          onClick={() => setActiveTab("upload")}
        >
          Upload File
        </button>
        <button
          className={`px-3 py-1 ${
            activeTab === "url" ? "tbx-tabs tbx-active" : "text-grey"
          }`}
          onClick={() => setActiveTab("url")}
        >
          Paste URL
        </button>
      </div>

      {activeTab === "upload" && (
        <div className="p-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onChange(e)}
            className="border p-2 w-full"
          />
        </div>
      )}

      {activeTab === "url" && (
        <div className="text-center p-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL here"
            className="border p-2 mb-2 block w-full"
          />
          <button
            onClick={handleUrlSubmit}
            className="tbx-bg-primary text-white px-4 py-2 rounded"
          >
            Embed image
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadMenu;
