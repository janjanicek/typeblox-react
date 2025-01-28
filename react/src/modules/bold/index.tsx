import React, { useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";

interface ModuleProps {
  isMenu?: boolean;
}

export const Bold: React.FC<ModuleProps> = ({ isMenu = false }) => {
  const { editor } = useTypebloxEditor();
  const [isBold, setIsBold] = useState(editor.isStyle("bold"));

  return (
    <button
      className={`block flex ${isMenu ? "p-2" : "px-2 py-1"} border-0 rounded hover:bg-gray-100 ${
        isBold ? "bg-gray-300" : ""
      }`}
      onClick={() => {
        const newStyle = editor.blox().getCurrentBlock()?.toggleBold();
        setIsBold(newStyle ?? false);
      }}
    >
      {isMenu ? (
        <>
          <span className="mr-2">
            <Icon name="Bold" />
          </span>{" "}
          <span>Bold</span>
        </>
      ) : (
        <Icon name="Bold" />
      )}
    </button>
  );
};
