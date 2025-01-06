import React, { useState } from "react";
import Icon from "../../components/Icon";
import { useEditor } from "../../utils/EditorContext";

export const Underline: React.FC = () => {
  const { editor } = useEditor();
  const [isUnderline, setIsUnderline] = useState(editor.isStyle("underline"));

  return (
    <button
      className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
        isUnderline ? "bg-gray-300 text-white" : ""
      }`}
      onClick={() => {
        const newStyle = editor.getCurrentBlock()?.toggleUnderline();
        setIsUnderline(newStyle ?? false);
      }}
    >
      <Icon src="/icons/underline.svg" />
    </button>
  );
};
