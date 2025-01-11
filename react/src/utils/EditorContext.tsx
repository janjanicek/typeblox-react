import { createContext, useContext } from "react";
import Typeblox from "@typeblox/core";

interface EditorContextProps {
  editor: Typeblox;
  onChange: (updatedHTMLString: string) => void;
}

// Create the context
export const EditorContext = createContext<EditorContextProps | undefined>(
  undefined,
);

// Create the hook
export const useEditor = (): EditorContextProps => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
