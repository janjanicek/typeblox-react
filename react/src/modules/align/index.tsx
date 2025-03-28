import React, { useState, useEffect, useRef } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import Tooltip from "../../components/Tooltip";
import { BLOCK_TYPES } from "@typeblox/core/dist/blockTypes";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import ContextualMenu from "../../components/menus/ContextualMenu";

interface AlignProps {
  block: Blox;
  isMenu?: boolean;
}

export const Align: React.FC<AlignProps> = ({ block, isMenu = false }) => {
  const { editor } = useTypebloxEditor();
  const [activeAlignment, setActiveAlignment] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const currentAlignment =
      block.getAttributes()["data-tbx-alignment"] ||
      block.getStyles().textAlign ||
      null;
    setActiveAlignment(currentAlignment);
  }, [editor]);

  const toggleAlignment = (alignment: string) => {
    if (block.type === BLOCK_TYPES.image || block.type === BLOCK_TYPES.video) {
      block.removeStyle("margin");
      if (alignment === "center") block.setStyle("margin", "auto");
      block.setAttribute("data-tbx-alignment", alignment);
    } else {
      // Toggle style for other block types
      block.toggleStyle("text-align", alignment);
    }

    setActiveAlignment(alignment);
  };

  const renderAlignmentOptions = () => (
    <div className="flex flex-col">
      {["left", "center", "right"].map((alignment) => (
        <button
          key={alignment}
          className={`p-2 flex ${
            activeAlignment === alignment ? "tbx-active" : ""
          }`}
          onClick={() => {
            toggleAlignment(alignment);
            setMenuVisible(false);
          }}
        >
          <span className="mr-2">
            <Icon
              name={`Align${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`}
            />
          </span>
          <span className="capitalize">Align {alignment}</span>
        </button>
      ))}
    </div>
  );

  return isMenu ? (
    <div>
      <Tooltip
        content={`Align ${activeAlignment ? activeAlignment.charAt(0).toUpperCase() + activeAlignment.slice(1) : "Left"}`}
      >
        <button
          ref={buttonRef}
          className={`px-2 py-1 border-0 rounded hover:bg-gray-100`}
          onClick={() => setMenuVisible(!menuVisible)}
        >
          <Icon
            name={`Align${activeAlignment ? activeAlignment.charAt(0).toUpperCase() + activeAlignment.slice(1) : "Left"}`}
          />
        </button>
      </Tooltip>
      {menuVisible && (
        <ContextualMenu
          referenceElement={buttonRef.current}
          isVisible={menuVisible}
          content={renderAlignmentOptions()}
          onClose={() => setMenuVisible(false)}
        />
      )}
    </div>
  ) : (
    <div className="flex space-x-2">
      <Tooltip content="Align left">
        <button
          className={`px-2 py-1 border-0 rounded ${
            activeAlignment === "left" ? "tbx-active" : ""
          }`}
          onClick={() => toggleAlignment("left")}
        >
          <Icon name="AlignLeft" />
        </button>
      </Tooltip>
      <Tooltip content="Align center">
        <button
          className={`px-2 py-1 border-0 rounded ${
            activeAlignment === "center" ? "tbx-active" : ""
          }`}
          onClick={() => toggleAlignment("center")}
        >
          <Icon name="AlignCenter" />
        </button>
      </Tooltip>
      <Tooltip content="Align right">
        <button
          className={`px-2 py-1 border-0 rounded ${
            activeAlignment === "right" ? "tbx-active" : ""
          }`}
          onClick={() => toggleAlignment("right")}
        >
          <Icon name="AlignRight" />
        </button>
      </Tooltip>
    </div>
  );
};
