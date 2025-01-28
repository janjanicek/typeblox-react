import Icon from "../../components/Icon";
import React, { useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";

interface ModuleProps {
  isMenu?: boolean;
}

export const Italic: React.FC<ModuleProps> = ({ isMenu }) => {
  const { editor } = useTypebloxEditor();
  const [isItalic, setIsItalic] = useState(editor.isStyle("italic"));

  return (
    <button
      className={`${isMenu ? "p-2" : "px-2 py-1"} border-0 rounded hover:bg-gray-100 ${
        isItalic ? "bg-gray-300" : ""
      }
      ${isMenu ? "flex" : ""}`}
      onClick={() => {
        const newStyle = editor.blox().getCurrentBlock()?.toggleItalic();
        setIsItalic(newStyle ?? false);
      }}
    >
      {isMenu ? (
        <>
          <span className="mr-2">
            <Icon name="Italic" />
          </span>{" "}
          <span>Italicize</span>
        </>
      ) : (
        <Icon name="Italic" />
      )}
    </button>
  );
};
