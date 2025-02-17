import React, { createContext, useContext } from "react";
import Typeblox from "@typeblox/core";
import {
  imageUploadFunction,
  onChangeFunction,
} from "@typeblox/core/dist/types";
import { editorSettingsProps } from "../utils/types";

interface EditorContextProps {
  editor: Typeblox;
  onChange: onChangeFunction;
  onImageUpload?: imageUploadFunction;
  editorSettings?: editorSettingsProps;
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
