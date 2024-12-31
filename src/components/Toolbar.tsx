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

interface ToolbarProps {
  textMenuPosition: { top: number; left: number };
}

const Toolbar: React.FC<ToolbarProps> = ({ textMenuPosition }) => {
  const {
    detectedStyles,
    setIsBold,
    setIsItalic,
    setIsUnderline,
    setIsStrikeout,
    setSelectedFont,
    setSelectedColor,
    setSelectedBgColor,
  } = useBlockStore();
  const { toolbarSettings } = useEditorStore();

  const toolbarComponents: Record<string, JSX.Element> = {
    bold: <Bold />,
    italic: <Italic />,
    underline: <Underline />,
    strikethrough: <Strikethrough />,
    divider: <Divider />,
    font: <Font />,
    color: <Color />,
    bgColor: <BgColor />,
  };

  // Update color pickers when the detected style changes
  useEffect(() => {
    if (detectedStyles.color) {
      const hexColor = rgbToHex(detectedStyles.color);
      setSelectedColor(hexColor);
    }

    if (detectedStyles.backgroundColor) {
      const hexBgColor = rgbToHex(detectedStyles.backgroundColor);
      setSelectedBgColor(hexBgColor);
    } else {
      setSelectedBgColor("#ffffff");
    }

    if (
      detectedStyles.fontFamily &&
      detectedStyles.fontFamily.indexOf("sans-serif") === -1
    ) {
      setSelectedFont(detectedStyles.fontFamily);
    } else {
      setSelectedFont("arial");
    }

    // Update other detected styles (e.g., bold, italic, underline, strikeout)
    setIsBold(detectedStyles.isBold);
    setIsItalic(detectedStyles.isItalic);
    setIsUnderline(detectedStyles.isUnderline);
    setIsStrikeout(detectedStyles.isStrikeout);
  }, [
    detectedStyles,
    setIsBold,
    setIsItalic,
    setIsUnderline,
    setIsStrikeout,
    setSelectedFont,
    setSelectedBgColor,
    setSelectedColor,
  ]);

  return (
    <div
      className="menu-container flex gap-1 absolute bg-white border border-gray-300 shadow-lg rounded p-2 w-max"
      style={{
        top: `${textMenuPosition.top}px`,
        left: `${textMenuPosition.left}px`,
        transform: "translate(-50%, -100%)",
        zIndex: 100,
        whiteSpace: "nowrap",
      }}
    >
      {toolbarSettings.map((moduleName, index) =>
        toolbarComponents[moduleName] ? (
          React.cloneElement(toolbarComponents[moduleName], {
            key: moduleName + "-" + index,
          })
        ) : (
          <div key={moduleName + "-" + index}></div>
        ),
      )}
    </div>
  );
};

export default Toolbar;
