import React, { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { useTypebloxEditor } from "../../context/EditorContext";
import { useBlock } from "../../context/BlockContext";
import Tooltip from "../../components/Tooltip";
import useEditorStore from "../../stores/EditorStore";

interface ModuleProps {
  isMenu?: boolean;
}

export const Underline: React.FC<ModuleProps> = ({ isMenu = false }) => {
  const { editor } = useTypebloxEditor();
  const { getShortcut } = useBlock();
  const { currentStyle } = useEditorStore();
  const [isUnderline, setIsUnderline] = useState(currentStyle?.isUnderline);

  const handleClick = () => {
    const newStyle = editor.blox().getCurrentBlock()?.toggleUnderline();
    setIsUnderline(newStyle ?? false);
  };

  useEffect(() => {
    setIsUnderline(currentStyle?.isUnderline ?? false);
  }, [currentStyle]);

  const shortcut = getShortcut("underline");

  return (
    <>
      {isMenu ? (
        <button
          className={`p-2 border-0 rounded hover:bg-gray-100 ${
            isUnderline ? "tbx-active" : ""
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
              isUnderline ? "tbx-active" : ""
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
