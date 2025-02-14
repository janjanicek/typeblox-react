import React, { useEffect } from "react";
import useBlockStore from "../stores/BlockStore";
import useEditorStore from "../stores/EditorStore";
import { rgbToHex } from "@typeblox/core/dist/utils/colors";
import { BlockType } from "@typeblox/core/dist/types";
import { useTypebloxEditor } from "../context/EditorContext";
import {
  useFloating,
  inline,
  offset,
  shift,
  flip,
  autoUpdate,
} from "@floating-ui/react";
import type { Blox } from "@typeblox/core/dist/classes/Blox";
import { EVENTS } from "@typeblox/core/dist/constants";
import { useBlock } from "../context/BlockContext";

interface ToolbarProps {
  block: Blox;
  setShowToolbar: Function;
  dragListeners: any;
}

const Toolbar: React.FC<ToolbarProps> = ({ block }) => {
  const { setSelectedColor, setSelectedBgColor } = useBlockStore();
  const { toolbarSettings } = useEditorStore();
  const { editor, theme } = useTypebloxEditor();
  const { getComponent } = useBlock();

  const { floatingStyles, refs, update } = useFloating({
    placement: "top", // Position the toolbar above the selection
    middleware: [
      inline(),
      offset(10), // Add a 10px gap between the toolbar and selection
      shift(), // Ensure the toolbar stays within the viewport
      flip(), // Flip the toolbar to the opposite side if there's no space
    ],
    whileElementsMounted: autoUpdate, // Dynamically reposition as needed
  });

  // Update color pickers when the detected style changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selectedElement = editor.getSelectionElement();
      if (selectedElement) {
        refs.setReference(selectedElement);
        update();
      }
    };

    const { color, backgroundColor } = editor.getSelectionStyle();

    if (color) {
      const hexColor = rgbToHex(color);
      setSelectedColor(hexColor);
    }

    if (backgroundColor) {
      const hexBgColor = rgbToHex(backgroundColor);
      setSelectedBgColor(hexBgColor);
    } else {
      setSelectedBgColor(theme === "light" ? "#ffffff" : "#000000");
    }

    editor.on(EVENTS.selectionChange, handleSelectionChange);

    // Cleanup listener on unmount
    return () => {
      editor.off(EVENTS.selectionChange, handleSelectionChange);
    };
  }, [editor, setSelectedBgColor, setSelectedColor, refs, update]);

  return (
    <>
      {toolbarSettings[block.type]?.length > 0 && (
        <div
          className="tbx-toolbar flex gap-1 absolute bg-white border border-gray-300 shadow-lg rounded p-2 w-max"
          ref={refs.setFloating} // Floating UI uses this ref for positioning
          style={{ ...floatingStyles, zIndex: 49, whiteSpace: "nowrap" }}
        >
          {toolbarSettings[block.type].map((moduleName, index) => {
            const component = getComponent({
              name: moduleName,
              isToolbar: true,
            }); // Retrieve the component
            return component ? (
              React.cloneElement(component, {
                key: `${moduleName}-${index}`,
              })
            ) : (
              <div key={`${moduleName}-${index}`}></div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Toolbar;
