import React, { useState } from "react";
import Icon from "../../components/Icon";
import { useEditor } from "../../utils/EditorContext";

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
      <Icon src="/icons/bold.svg" />
    </button>
  );
};
