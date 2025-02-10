import React, { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { useTypebloxEditor } from "../../context/EditorContext";
import { useBlock } from "../../context/BlockContext";
import Tooltip from "../../components/Tooltip";
import { EVENTS } from "@typeblox/core/dist/constants";

interface ModuleProps {
  isMenu?: boolean;
}

export const Underline: React.FC<ModuleProps> = ({ isMenu = false }) => {
  const { editor } = useTypebloxEditor();
  const { getShortcut } = useBlock();
  const [isUnderline, setIsUnderline] = useState(editor.isStyle("underline"));

  const handleClick = () => {
    const newStyle = editor.blox().getCurrentBlock()?.toggleUnderline();
    setIsUnderline(newStyle ?? false);
  };

  useEffect(() => {
    const checkUnderline = () => {
      setIsUnderline(editor.isStyle("underline"));
    };
    checkUnderline();
    editor.on(EVENTS.styleChange, checkUnderline);
    return () => {
      editor.off(EVENTS.styleChange, checkUnderline);
    };
  }, [editor]);

  const shortcut = getShortcut("underline");

  return (
    <>
      {isMenu ? (
        <button
          className={`p-2 border-0 rounded hover:bg-gray-100 ${
            isUnderline ? "bg-gray-300" : ""
          } flex justify-between`}
          onClick={handleClick}
        >
          <span className="flex items-center">
            <span className="mr-2">
              <Icon name="Underline" />
            </span>
            <span>Underline</span>
          </span>
          <span>{shortcut}</span>
        </button>
      ) : (
        <Tooltip content={`Underline (${shortcut})`}>
          <button
            className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
              isUnderline ? "bg-gray-300" : ""
            }`}
            onClick={handleClick}
          >
            <Icon name="Underline" />
          </button>
        </Tooltip>
      )}
    </>
  );
};
