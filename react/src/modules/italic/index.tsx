import Icon from "../../components/Icon";
import React, { useState } from "react";
import { useEditor } from "../../utils/EditorContext";

export const Italic: React.FC = () => {
  const { editor } = useEditor();
  const [isItalic, setIsItalic] = useState(editor.isStyle("italic"));

  return (
    <button
      className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
        isItalic ? "bg-gray-300 text-white" : ""
      }`}
      onClick={() => {
        const newStyle = editor.getCurrentBlock()?.toggleItalic();
        setIsItalic(newStyle ?? false);
      }}
    >
      <Icon name="italic" />
    </button>
  );
};
