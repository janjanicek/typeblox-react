import React, { createContext, useContext } from "react";
import Typeblox from "@typeblox/core";
import {
  imageUploadFunction,
  onChangeFunction,
} from "@typeblox/core/dist/types";

interface EditorContextProps {
  editor: Typeblox;
  onChange: onChangeFunction;
  onImageUpload?: imageUploadFunction;
  theme?: string;
}

// Create the context
export const EditorContext = createContext<EditorContextProps | undefined>(
  undefined,
);

// Create the hook
export const useTypebloxEditor = (): EditorContextProps => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
