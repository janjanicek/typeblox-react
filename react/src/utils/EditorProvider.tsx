import React, { ReactNode, useEffect, useMemo, useState } from "react";
import Typeblox from "@typeblox/core";
import { EditorContext } from "./EditorContext";
import Editor from "../components/Editor";

interface EditorProviderProps {
  content: string;
  onChange: (updatedHTMLString: string) => void;
  toolbars?: Record<string, string>;
  extensions?: string[];
  height?: number;
  children?: ReactNode;
  slotBefore?: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  content,
  onChange,
  toolbars,
  extensions = [],
  slotBefore,
  children,
}) => {
  // State to hold the editor instance
  const [TypeBoxEditor, setTypeBoxEditor] = useState<Typeblox | null>(null);

  // Initialize the Typeblox instance
  useEffect(() => {
    const editor = new Typeblox();
    editor.init({
      HTMLString: content,
      onUpdate: onChange,
    });
    setTypeBoxEditor(editor);

    // Cleanup editor instance on unmount
    return () => {
      editor.destroy?.();
    };
  }, [content, onChange]);

  // Ensure the editor instance is ready before rendering
  if (!TypeBoxEditor) {
    return null; // Optionally render a loader or fallback UI here
  }

  return (
    <EditorContext.Provider
      value={{
        editor: TypeBoxEditor,
        onChange,
      }}
    >
      <>
        {slotBefore && <div>{slotBefore}</div>}
        <Editor
          onChange={onChange}
          toolbars={toolbars}
          extensions={extensions}
        />
        {children}
      </>
    </EditorContext.Provider>
  );
};
