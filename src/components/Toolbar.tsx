import React, { useEffect, JSX } from "react";
import {
  Bold,
  Color,
  Font,
  Italic,
  Strikethrough,
  Underline,
} from "../modules";
import { BgColor } from "../modules/bgColor";
import { Divider } from "../modules/divider";
import useBlockStore from "../stores/BlockStore";
import useEditorStore from "../stores/EditorStore";
import { rgbToHex } from "../.core/utils/colors";
import { BlockType } from "../.core/types";
import { TypeChange } from "../modules/typeChange";
import { ViewAsCode } from "../modules/viewAsCode";
import { useEditor } from "../utils/EditorContext";
import {
  useFloating,
  inline,
  offset,
  shift,
  flip,
  autoUpdate,
} from "@floating-ui/react";
import type { Blox } from "../.core/classes/Blox";
import { EVENTS } from "../.core/constants";

interface ToolbarProps {
  block: Blox;
  onUpdate: (update: {
    id: string;
    content?: string;
    type?: BlockType;
  }) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ block, onUpdate }) => {
  const { setSelectedColor, setSelectedBgColor } = useBlockStore();
  const { toolbarSettings } = useEditorStore();
  const { editor } = useEditor();

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

  const toolbarComponents: Record<string, JSX.Element> = {
    bold: <Bold />,
    italic: <Italic />,
    underline: <Underline />,
    strikethrough: <Strikethrough />,
    divider: <Divider />,
    font: <Font />,
    color: <Color />,
    bgColor: <BgColor />,
    viewCode: <ViewAsCode block={block} />,
    type: <TypeChange block={block} onUpdate={onUpdate} />,
  };

  // Update color pickers when the detected style changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selectedElement = editor.getSelectionElement();
      console.log(selectedElement);
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
      setSelectedBgColor("#ffffff");
    }

    editor.on(EVENTS.selectionChange, handleSelectionChange);

    // Cleanup listener on unmount
    return () => {
      editor.off(EVENTS.selectionChange, handleSelectionChange);
    };
  }, [editor, setSelectedBgColor, setSelectedColor, refs, update]);

  return (
    <>
      {toolbarSettings[block.type].length > 0 && (
        <div
          className="menu-container flex gap-1 absolute bg-white border border-gray-300 shadow-lg rounded p-2 w-max"
          ref={refs.setFloating} // Floating UI uses this ref for positioning
          style={{ ...floatingStyles, zIndex: 49, whiteSpace: "nowrap" }}
        >
          {toolbarSettings[block.type].map((moduleName, index) =>
            toolbarComponents[moduleName] ? (
              React.cloneElement(toolbarComponents[moduleName], {
                key: moduleName + "-" + index,
              })
            ) : (
              <div key={moduleName + "-" + index}></div>
            ),
          )}
        </div>
      )}
    </>
  );
};

export default Toolbar;
