import React, { FC } from "react";
import { useBlock } from "../context/BlockContext";
import useEditorStore from "../stores/EditorStore";

const BlockMenu: FC = () => {
  const { getComponent } = useBlock();
  const { menuSettings } = useEditorStore();

  return (
    <>
      <div
        className="tbx-actions items-center space-x-1 flex"
        style={{ left: "-55px", top: "10px" }}
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
