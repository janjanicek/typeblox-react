import React from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import { useBlock } from "../../context/BlockContext";
import Tooltip from "../../components/Tooltip";
import useEditorStore from "../../stores/EditorStore";

interface ModuleProps {
  isMenu?: boolean;
}

export const Bold: React.FC<ModuleProps> = ({ isMenu = false }) => {
  const { editor } = useTypebloxEditor();
  const { getShortcut } = useBlock();

  const { currentStyle } = useEditorStore();
  const isBold = currentStyle?.isBold;

  const handleClick = () => {
    const block = editor.blox().getCurrentBlock();
    if (!block) return;
    block.toggleBold();
  };

  const commonProps = {
    onClick: handleClick,
    "data-test": "bold" as const,
  } as const;

  return (
    <>
      {isMenu ? (
        <button
          {...commonProps}
          className={`block flex p-2 border-0 rounded hover:bg-gray-100 justify-between ${
            isBold ? "tbx-active" : ""
          }`}
        >
          <span className="flex items-center">
            <span className="mr-2">
              <Icon name="Bold" />
            </span>{" "}
            <span>Bold</span>
          </span>
          <span>{getShortcut("bold")}</span>
        </button>
      ) : (
        <Tooltip content={`Bold (${getShortcut("bold")})`}>
          <button
            {...commonProps}
            className={`block px-2 py-1 border-0 rounded hover:bg-gray-100 ${
              isBold ? "tbx-active" : ""
            }`}
          >
            <Icon name="Bold" />
          </button>
        </Tooltip>
      )}
    </>
  );
};
