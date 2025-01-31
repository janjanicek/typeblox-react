import React, { ReactNode, useEffect, useRef, useState } from "react";
import Typeblox from "@typeblox/core";
import { EditorContext } from "../context/EditorContext";
import Editor from "../components/Editor";
import { imageUploadFunction } from "./types";
import { Extension } from "@typeblox/core/dist/types";

interface EditorProviderProps {
  content: string;
  onChange: (updatedHTMLString: string) => void;
  onImageUpload?: imageUploadFunction;
  toolbars?: Record<string, string>;
  menus?: Record<string, Array<string>>;
  extensions?: Extension[];
  height?: number;
  children?: ReactNode;
  slotBefore?: ReactNode;
}

declare global {
  interface Window {
    typebloxEditor?: Typeblox;
  }
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  content,
  onChange,
  onImageUpload,
  toolbars,
  menus,
  extensions = [],
  children,
  slotBefore,
}) => {
  const [typeBoxEditor, setTypeBoxEditor] = useState<Typeblox | null>(null);
  const editorRef = useRef<Typeblox | null>(null);

  const cleanupEditor = () => {
    console.warn("Cleaning up editor:", editorRef.current);
    try {
      if (editorRef.current) editorRef.current.destroy();
      if (window.typebloxEditor === editorRef.current) {
        delete window.typebloxEditor;
      }
    } catch (error) {
      console.error("Failed to destroy Typeblox editor:", error);
    } finally {
      editorRef.current = null;
      setTypeBoxEditor(null);
    }
  };

  useEffect(() => {
    if (editorRef.current) return; // Prevent reinitialization

    try {
      const editor = new Typeblox();
      editor.init({
        HTMLString: content,
        onUpdate: onChange,
        onImageUpload,
        extensions,
      });

      console.log(editor);

      // Set both the ref and the state
      editorRef.current = editor;
      setTypeBoxEditor(editor);

      console.warn("Editor initialized:", editor.blox().getBlox());
    } catch (error) {
      console.error("Failed to initialize Typeblox editor:", error);
    }

    return () => cleanupEditor(); // Cleanup on unmount
  }, []);

  if (!typeBoxEditor) {
    return <div>Loading editor...</div>;
  }

  return (
    <EditorContext.Provider
      value={{ editor: typeBoxEditor, onChange, onImageUpload }}
    >
      <div>
        {slotBefore && <div>{slotBefore}</div>}
        <Editor toolbars={toolbars} extensions={extensions} menus={menus} />
        {children}
      </div>
    </EditorContext.Provider>
  );
};

export default EditorProvider;
