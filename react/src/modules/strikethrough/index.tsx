import React, { useState } from "react";
import { useEditor } from "../../utils/EditorContext";
import Icon from "../../components/Icon";

export const Strikethrough: React.FC = () => {
  const { editor } = useEditor();
  const [isStrikethrough, setIsStrikethrough] = useState(
    editor.isStyle("strikethrough"),
  );

  return (
    <button
      className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
        isStrikethrough ? "bg-gray-300 text-white" : ""
      }`}
      onClick={() => {
        const newStyle = editor.getCurrentBlock()?.toggleStrike();
        setIsStrikethrough(newStyle ?? false);
      }}
    >
      <Icon name="strike" />
    </button>
  );
};
