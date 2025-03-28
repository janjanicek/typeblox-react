import Icon from "../../components/Icon";
import React, { useEffect, useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import { useBlock } from "../../context/BlockContext";
import Tooltip from "../../components/Tooltip";
import useEditorStore from "../../stores/EditorStore";

interface ModuleProps {
  isMenu?: boolean;
}

export const Italic: React.FC<ModuleProps> = ({ isMenu }) => {
  const { editor } = useTypebloxEditor();
  const { getShortcut } = useBlock();
  const { currentStyle } = useEditorStore();
  const [isItalic, setIsItalic] = useState(currentStyle?.isItalic);

  const handleClick = () => {
    const newStyle = editor.blox().getCurrentBlock()?.toggleItalic();
    setIsItalic(newStyle ?? false);
  };

  useEffect(() => {
    setIsItalic(currentStyle?.isItalic ?? false);
  }, [currentStyle]);

  const shortcut = getShortcut("italic");

  return (
    <>
      {isMenu ? (
        <button
          className={`p-2 border-0 rounded hover:bg-gray-100 ${
            isItalic ? "tbx-active" : ""
          } flex justify-between`}
          onClick={handleClick}
        >
          <span className="flex items-center">
            <span className="mr-2">
              <Icon name="Italic" />
            </span>
            <span>Italicize</span>
          </span>
          <span>{shortcut}</span>
        </button>
      ) : (
        <Tooltip content={`Italic (${shortcut})`}>
          <button
            className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
              isItalic ? "tbx-active" : ""
            }`}
            onClick={handleClick}
          >
            <Icon name="Italic" />
          </button>
        </Tooltip>
      )}
    </>
  );
};
