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
import { rgbToHex } from "../.core/utils";
import { Block, BlockType } from "../.core/types";
import { TypeChange } from "../modules/typeChange";
import { useEditor } from "../utils/EditorContext";
import {
  useFloating,
  inline,
  offset,
  shift,
  flip,
  autoPlacement,
  autoUpdate,
} from "@floating-ui/react";

interface ToolbarProps {
  block: Block;
  onUpdate: (update: {
    id: string;
    content?: string;
    type?: BlockType;
  }) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ block, onUpdate }) => {
  const {
    setIsBold,
    setIsItalic,
    setIsUnderline,
    setIsStrikeout,
    setSelectedFont,
    setSelectedColor,
    setSelectedBgColor,
  } = useBlockStore();
  const { toolbarSettings } = useEditorStore();
  const { editor } = useEditor();

  const { floatingStyles, refs } = useFloating({
    placement: "bottom", // Position the toolbar above the selection
    middleware: [
      inline(),
      offset(10), // Add a 10px gap between the toolbar and selection
      shift(), // Ensure the toolbar stays within the viewport
      flip(), // Flip the toolbar to the opposite side if there's no space
      autoPlacement(),
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
    type: <TypeChange block={block} onUpdate={onUpdate} />,
  };

  // Update color pickers when the detected style changes
  useEffect(() => {
    const selectedElement = editor.getSelectionElement();
    if (selectedElement) refs.setReference(selectedElement);

    const {
      color,
      backgroundColor,
      fontFamily,
      isBold,
      isItalic,
      isStrikeout,
      isUnderline,
    } = editor.getSelectionStyle();

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

    if (fontFamily && fontFamily.indexOf("sans-serif") === -1) {
      setSelectedFont(fontFamily);
    } else {
      setSelectedFont("arial");
    }

    // Update other detected styles (e.g., bold, italic, underline, strikeout)
    setIsBold(isBold);
    setIsItalic(isItalic);
    setIsUnderline(isUnderline);
    setIsStrikeout(isStrikeout);
  }, [
    editor,
    setIsBold,
    setIsItalic,
    setIsUnderline,
    setIsStrikeout,
    setSelectedFont,
    setSelectedBgColor,
    setSelectedColor,
    refs,
  ]);

  return (
    <>
      {toolbarSettings[block.type].length > 0 && (
        <div
          className="menu-container flex gap-1 absolute bg-white border border-gray-300 shadow-lg rounded p-2 w-max"
          ref={refs.setFloating} // Floating UI uses this ref for positioning
          style={{ ...floatingStyles, zIndex: 100, whiteSpace: "nowrap" }}
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
