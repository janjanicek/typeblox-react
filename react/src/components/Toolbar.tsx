import React, { useEffect, useState } from "react";
import useBlockStore from "../stores/BlockStore";
import useEditorStore from "../stores/EditorStore";
import { rgbToHex } from "@typeblox/core/dist/utils/colors";
import { useTypebloxEditor } from "../context/EditorContext";
import {
  useFloating,
  inline,
  offset,
  shift,
  flip,
  autoUpdate,
} from "@floating-ui/react";
import { EVENTS } from "@typeblox/core/dist/constants";
import { useBlock } from "../context/BlockContext";
import { useToolbar } from "../context/ToolbarContext";
import { BLOCK_TYPES } from "@typeblox/core/dist/blockTypes";
import { getRange } from "../utils/helpers";

interface ToolbarProps {
  showPermanently?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ showPermanently }) => {
  const { setSelectedColor, setSelectedBgColor } = useBlockStore();
  const { toolbarSettings, setCurrentStyle, editorRef, currentBlock } =
    useEditorStore();
  const { isToolbarActive, show, activeBlockId } = useToolbar();
  const { editor, editorSettings } = useTypebloxEditor();
  const { getComponent, block } = useBlock();

  const isInlineToolbar = editorSettings?.toolbarType === "inline";

  const [isPositioned, setIsPositioned] = useState(false);

  const floatingData = isInlineToolbar
    ? useFloating({
        placement: editorSettings?.toolbarPosition || "top",
        middleware: [inline(), offset(10), shift(), flip()],
        whileElementsMounted: autoUpdate,
      })
    : null;

  const { floatingStyles, refs, update } = floatingData || {};

  // Update color pickers when the detected style changes
  useEffect(() => {
    if (
      showPermanently ||
      (block.type === BLOCK_TYPES.image &&
        currentBlock?.type === BLOCK_TYPES.image) ||
      (block.type === BLOCK_TYPES.video &&
        currentBlock?.type === BLOCK_TYPES.video &&
        editor.blox().getCurrentBlock()?.id === block.id)
    ) {
      show(block.id);
      setIsPositioned(true);
    }

    const handleSelectionChange = () => {
      const range = getRange();
      const currentBlockId = editor.blox().getCurrentBlock()?.id;

      if (currentBlockId !== block.id || currentBlockId === activeBlockId) {
        return;
      }

      if (isInlineToolbar && range && refs) {
        refs.setReference({
          getBoundingClientRect: () => range.getBoundingClientRect(),
          getClientRects: () => range.getClientRects(),
        });

        if (!isToolbarActive(block.id)) {
          show(block.id);
          setIsPositioned(true);
          update?.();
        }
      }

      const newStyle = editor.style().getStyle();
      setCurrentStyle(newStyle);

      setSelectedColor(
        newStyle?.color
          ? rgbToHex(newStyle.color)
          : editorSettings?.theme === "light"
            ? "#000000"
            : "#ffffff",
      );

      setSelectedBgColor(
        newStyle?.backgroundColor
          ? rgbToHex(newStyle.backgroundColor)
          : editorSettings?.theme === "light"
            ? "#ffffff"
            : "#000000",
      );
    };

    // Listeners for selection and mouse interactions
    document.addEventListener("selectionchange", handleSelectionChange);
    window.addEventListener("mouseup", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("mouseup", handleSelectionChange);
    };
  }, [
    editor,
    setSelectedBgColor,
    setSelectedColor,
    refs,
    update,
    editorRef,
    isInlineToolbar,
    currentBlock,
    show,
    editorSettings?.theme,
    showPermanently,
  ]);

  useEffect(() => {
    const updateStyles = () => {
      setCurrentStyle(editor.getSelectionStyle());
    };
    editor.on(EVENTS.styleChange, updateStyles);
    return () => {
      editor.off(EVENTS.styleChange, updateStyles);
    };
  }, [editor]);

  return (
    <>
      {isToolbarActive(block.id) &&
        isPositioned &&
        toolbarSettings[block.type]?.length > 0 && (
          <div
            className={`tbx-toolbar ${isInlineToolbar ? "tbx-toolbar-inline" : "tbx-toolbar-block"} flex gap-1 ${isInlineToolbar ? "bg-white border border-gray-300 shadow-lg rounded" : ""} w-max`}
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
