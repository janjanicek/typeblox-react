import React, { useState } from "react";
import { useEditor } from "../../utils/EditorContext";
import Icon from "../../components/Icon";

export const Bold: React.FC = () => {
  const { editor } = useEditor();
  const [isBold, setIsBold] = useState(editor.isStyle("bold"));

  return (
    <button
      className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
        isBold ? "bg-gray-300 text-white" : ""
      }`}
      onClick={() => {
        const newStyle = editor.getCurrentBlock()?.toggleBold();
        setIsBold(newStyle ?? false);
      }}
    >
      <Icon name="bold" />
    </button>
  );
};
