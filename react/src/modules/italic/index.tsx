import Icon from "../../components/Icon";
import React from "react";
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
  const isItalic = currentStyle?.isItalic;

  const handleClick = () => {
    const block = editor.blox().getCurrentBlock();
    if (!block) return;
    editor.blox().getCurrentBlock()?.toggleItalic();
  };

  const commonProps = {
    onClick: handleClick,
    "data-test": "italic" as const,
  } as const;

  return (
    <>
      {isMenu ? (
        <button
          {...commonProps}
          className={`p-2 border-0 rounded hover:bg-gray-100 ${
            isItalic ? "tbx-active" : ""
          } flex justify-between`}
        >
          <span className="flex items-center">
            <span className="mr-2">
              <Icon name="Italic" />
            </span>
            <span>Italicize</span>
          </span>
          <span>{getShortcut("italic")}</span>
        </button>
      ) : (
        <Tooltip content={`Italic (${getShortcut("italic")})`}>
          <button
            {...commonProps}
            className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
              isItalic ? "tbx-active" : ""
            }`}
          >
            <Icon name="Italic" />
          </button>
        </Tooltip>
      )}
    </>
  );
};
