import React, { useEffect, useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import { useBlock } from "../../context/BlockContext";
import Tooltip from "../../components/Tooltip";
import { EVENTS } from "@typeblox/core/dist/constants";
import useEditorStore from "../../stores/EditorStore";

interface ModuleProps {
  isMenu?: boolean;
}

export const Bold: React.FC<ModuleProps> = ({ isMenu = false }) => {
  const { editor } = useTypebloxEditor();
  const { getShortcut } = useBlock();
  const { currentStyle } = useEditorStore();
  const [isBold, setIsBold] = useState(currentStyle?.isBold);

  const handleClick = () => {
    const newStyle = editor.blox().getCurrentBlock()?.toggleBold();
    setIsBold(newStyle ?? false);
  };

  useEffect(() => {
    setIsBold(currentStyle?.isBold ?? false);
  }, [currentStyle]);

  return (
    <>
      {isMenu ? (
        <button
          className={`block flex p-2 border-0 rounded hover:bg-gray-100 justify-between ${
            isBold ? "tbx-active" : ""
          }`}
          onClick={handleClick}
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
            className={`block px-2 py-1 border-0 rounded hover:bg-gray-100 ${
              isBold ? "tbx-active" : ""
            }`}
            onClick={handleClick}
          >
            <Icon name="Bold" />
          </button>
        </Tooltip>
      )}
    </>
  );
};
