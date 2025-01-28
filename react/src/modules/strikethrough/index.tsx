import React, { useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";

interface ModuleProps {
  isMenu?: boolean;
}

export const Strikethrough: React.FC<ModuleProps> = ({ isMenu }) => {
  const { editor } = useTypebloxEditor();
  const [isStrikethrough, setIsStrikethrough] = useState(
    editor.isStyle("strikethrough"),
  );

  return (
    <button
      className={`${isMenu ? "p-2" : "px-2 py-1"} border-0 rounded hover:bg-gray-100 ${
        isStrikethrough ? "bg-gray-300" : ""
      }
      ${isMenu ? "flex" : ""}`}
      onClick={() => {
        const newStyle = editor.blox().getCurrentBlock()?.toggleStrike();
        setIsStrikethrough(newStyle ?? false);
      }}
    >
      {isMenu ? (
        <>
          <span className="mr-2">
            <Icon name="Strike" />
          </span>{" "}
          <span>Strike-through</span>
        </>
      ) : (
        <Icon name="Strike" />
      )}
    </button>
  );
};
