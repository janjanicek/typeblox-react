import React, { useState } from "react";
import Icon from "../../components/Icon";
import { useTypebloxEditor } from "../../context/EditorContext";

interface ModuleProps {
  isMenu?: boolean;
}

export const Underline: React.FC<ModuleProps> = ({ isMenu = false }) => {
  const { editor } = useTypebloxEditor();
  const [isUnderline, setIsUnderline] = useState(editor.isStyle("underline"));

  return (
    <button
      className={`${isMenu ? "p-2" : "px-2 py-1"} border-0 rounded hover:bg-gray-100 ${
        isUnderline ? "bg-gray-300" : ""
      } 
        ${isMenu ? "flex" : ""}`}
      onClick={() => {
        const newStyle = editor.blox().getCurrentBlock()?.toggleUnderline();
        setIsUnderline(newStyle ?? false);
      }}
    >
      {isMenu ? (
        <>
          <span className="mr-2">
            <Icon name="Underline" />
          </span>{" "}
          <span>Underline</span>
        </>
      ) : (
        <Icon name="Underline" />
      )}
    </button>
  );
};

interface ModuleProps {
  isMenu?: boolean;
}
