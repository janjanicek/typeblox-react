import { Typeblox } from "../.core";
import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { BlockType } from "../.core/types"; // Fixed import path
import Editor from "../components/Editor";

interface EditorContextProps {
  editor: Typeblox;
  onChange: (updatedHTMLString: string) => void;
}

interface EditorProviderProps {
  content: string;
  onChange: (updatedHTMLString: string) => void;
  toolbars?: Partial<Record<BlockType, string>>;
  extensions?: string[];
  height?: number;
  children?: ReactNode; // Added to allow nesting other components
  slotBefore?: ReactNode;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export const useEditor = (): EditorContextProps => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};

export const EditorProvider: React.FC<EditorProviderProps> = ({
  content,
  onChange,
  toolbars,
  extensions,
  height,
  children,
  slotBefore,
}) => {
  // Memoize the Typeblox editor instance
  const TypeBoxEditor = useMemo(() => new Typeblox(), []);

  TypeBoxEditor.init({
    HTMLString: content,
    onUpdate: onChange,
  });

  return (
    <EditorContext.Provider
      value={{
        editor: TypeBoxEditor,
        onChange,
      }}
    >
      {slotBefore && <div>{slotBefore}</div>}
      <Editor
        onChange={onChange}
        toolbars={toolbars}
        extensions={extensions}
        height={height}
      />
      {children}
    </EditorContext.Provider>
  );
};
