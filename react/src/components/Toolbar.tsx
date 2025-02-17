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
}

const Toolbar: React.FC<ToolbarProps> = ({ block }) => {
  const { setSelectedColor, setSelectedBgColor } = useBlockStore();
  const { toolbarSettings } = useEditorStore();
  const { editor, editorSettings } = useTypebloxEditor();
  const { getComponent } = useBlock();

  const isInlineToolbar = editorSettings?.toolbarType === "inline";

  const floatingData = isInlineToolbar
    ? useFloating({
        placement: editorSettings?.toolbarPosition,
        middleware: [inline(), offset(10), shift(), flip()],
        whileElementsMounted: autoUpdate,
      })
    : null;

  const { floatingStyles, refs, update } = floatingData || {};

  // Update color pickers when the detected style changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selectedElement = editor.getSelectionElement();
      if (selectedElement && refs?.setReference) {
        refs.setReference(selectedElement);
        update?.();
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
      setSelectedBgColor(
        editorSettings?.theme === "light" ? "#ffffff" : "#000000",
      );
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
          className={`tbx-toolbar ${isInlineToolbar ? "tbx-toolbar-inline" : "tbx-toolbar-block"} flex gap-1 ${isInlineToolbar ? "absolute bg-white border border-gray-300 shadow-lg rounded" : ""} w-max`}
          ref={isInlineToolbar ? refs?.setFloating : undefined} // Apply ref only if Floating UI is enabled
          style={
            isInlineToolbar
              ? {
                  ...floatingStyles,
                  ...editorSettings?.toolbarStyle,
                  zIndex: 49,
                  whiteSpace: "nowrap",
                }
              : { ...editorSettings?.toolbarStyle }
          }
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
