import React, { useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";

interface ExtensionProps {
  name: string;
}

export const Extension: React.FC<ExtensionProps> = ({ name }) => {
  const { editor } = useTypebloxEditor();

  const registeredExtension = editor.extensions().getExtension(name);
  if (!registeredExtension) return null;
  const { isActive, onClick, icon, iconElement, component } =
    registeredExtension;

  return component ? (
    <>{component()}</>
  ) : (
    <button
      className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
        isActive() ? "tbx-active" : ""
      }`}
      onClick={() => {
        if (typeof onClick === "function") {
          onClick(); // Call the extension's click handler
        } else {
          console.log(
            `onClick handler for extension "${name}" is not a function.`,
          );
        }
      }}
    >
      {iconElement ?? <Icon name={icon} />}
    </button>
  );
};
