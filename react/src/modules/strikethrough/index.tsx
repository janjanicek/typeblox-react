import React from "react";
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
  const isStrikethrough = currentStyle?.isStrikeout;

  const handleClick = () => {
    const block = editor.blox().getCurrentBlock();
    if (!block) return;
    editor.blox().getCurrentBlock()?.toggleStrike();
  };

  const commonProps = {
    onClick: handleClick,
    "data-test": "strike-through" as const,
  } as const;

  return (
    <>
      {isMenu ? (
        <button
          {...commonProps}
          className={`p-2 border-0 rounded hover:bg-gray-100 ${
            isStrikethrough ? "tbx-active" : ""
          } flex`}
        >
          <span className="flex items-center">
            <span className="mr-2">
              <Icon name="Strike" />
            </span>
            <span>Strike-through</span>
          </span>
          <span>{getShortcut("strikethrough")}</span>
        </button>
      ) : (
        <Tooltip content={`Strike-through (${getShortcut("strikethrough")})`}>
          <button
            {...commonProps}
            className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
              isStrikethrough ? "tbx-active" : ""
            }`}
          >
            <Icon name="Strike" />
          </button>
        </Tooltip>
      )}
    </>
  );
};
