import React, {  } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import Tooltip from "../../components/Tooltip";

interface ModuleProps {
  isMenu?: boolean;
}

export const ClearFormatting: React.FC<ModuleProps> = ({ isMenu = false }) => {
  const { editor } = useTypebloxEditor();

  const handleClick = () => {
    const newStyle = editor.style().clearFormat();
  };

  return (
    <>
      {isMenu ? (
        <button
          className={`block flex p-2 border-0 rounded hover:bg-gray-100 justify-between`}
          onClick={handleClick}
        >
            <span className="mr-2">
              <Icon name="ClearFormatting" />
            </span>{" "}
            <span>Clear Formatting</span>
        </button>
      ) : (
        <Tooltip content={`ClearFormatting`}>
          <button
            className={`block px-2 py-1 border-0 rounded hover:bg-gray-100`}
            onClick={handleClick}
          >
            <Icon name="ClearFormatting" />
          </button>
        </Tooltip>
      )}
    </>
  );
};
