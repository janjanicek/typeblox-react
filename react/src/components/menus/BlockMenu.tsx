import { useFloating, offset, shift, autoUpdate } from "@floating-ui/react";
import React, { FC, RefObject } from "react";
import { useBlock } from "../../context/BlockContext";
import useEditorStore from "../../stores/EditorStore";

interface BlockMenuProps {
  referenceElement: RefObject<HTMLElement>; // Accept external reference
  onHoverChange?: (isHovered: boolean) => void; // Callback for hover state changes
}

const BlockMenu: FC<BlockMenuProps> = ({ referenceElement, onHoverChange }) => {
  const { getComponent } = useBlock();
  const { menuSettings } = useEditorStore();

  const { refs, floatingStyles } = useFloating({
    placement: "left-start", // Position the menu to the left
    middleware: [offset(2), shift()], // Ensure positioning stays in bounds
    elements: {
      reference: referenceElement.current, // Use the passed external reference
    },
    whileElementsMounted: autoUpdate, // Auto update position
  });

  return (
    <>
      <div
        ref={refs.setFloating}
        className="tbx-actions items-center flex"
        style={floatingStyles}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
      >
        {menuSettings["block"].map((moduleName, index) => {
          const component = getComponent({ name: moduleName }); // Retrieve the component
          return component ? (
            React.cloneElement(component, {
              key: `${moduleName}-${index}`,
            })
          ) : (
            <div key={`${moduleName}-${index}`}></div>
          );
        })}
      </div>
    </>
  );
};

export default BlockMenu;
