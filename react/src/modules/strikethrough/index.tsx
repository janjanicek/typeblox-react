import React, { useEffect, useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import { useBlock } from "../../context/BlockContext";
import Icon from "../../components/Icon";
import Tooltip from "../../components/Tooltip";
import useEditorStore from "../../stores/EditorStore";

interface ModuleProps {
  isMenu?: boolean;
}

export const Strikethrough: React.FC<ModuleProps> = ({ isMenu }) => {
  const { editor } = useTypebloxEditor();
  const { getShortcut } = useBlock();
  const { currentStyle } = useEditorStore();
  const [isStrikethrough, setIsStrikethrough] = useState(
    currentStyle?.isStrikeout,
  );

  const handleClick = () => {
    const newStyle = editor.blox().getCurrentBlock()?.toggleStrike();
    setIsStrikethrough(newStyle ?? false);
  };

  useEffect(() => {
    setIsStrikethrough(currentStyle?.isStrikeout ?? false);
  }, [currentStyle]);

  const shortcut = getShortcut("strikethrough");

  return (
    <>
      {isMenu ? (
        <button
          className={`p-2 border-0 rounded hover:bg-gray-100 ${
            isStrikethrough ? "tbx-active" : ""
          } flex`}
          onClick={handleClick}
        >
          <span className="mr-2">
            <Icon name="Strike" />
          </span>
          <span>Strike-through</span>
        </button>
      ) : (
        <Tooltip content={`Strike-through`}>
          <button
            className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
              isStrikethrough ? "tbx-active" : ""
            }`}
            onClick={handleClick}
          >
            <Icon name="Strike" />
          </button>
        </Tooltip>
      )}
    </>
  );
};
