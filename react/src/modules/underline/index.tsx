import React from "react";
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
  const isUnderline = currentStyle?.isUnderline;

  const handleClick = () => {
    const block = editor.blox().getCurrentBlock();
    if (!block) return;
    editor.blox().getCurrentBlock()?.toggleUnderline();
  };

  const commonProps = {
    onClick: handleClick,
    "data-test": "underline" as const,
  } as const;

  return (
    <>
      {isMenu ? (
        <button
          {...commonProps}
          className={`p-2 border-0 rounded hover:bg-gray-100 ${
            isUnderline ? "tbx-active" : ""
          } flex justify-between`}
        >
          <span className="flex items-center">
            <span className="mr-2">
              <Icon name="Underline" />
            </span>
            <span>Underline</span>
          </span>
          <span>{getShortcut("underline")}</span>
        </button>
      ) : (
        <Tooltip content={`Underline (${getShortcut("underline")})`}>
          <button
            {...commonProps}
            className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
              isUnderline ? "tbx-active" : ""
            }`}
          >
            <Icon name="Underline" />
          </button>
        </Tooltip>
      )}
    </>
  );
};
