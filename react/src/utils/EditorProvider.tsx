import React, { Component, ReactNode } from "react";
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

interface EditorProviderState {
  TypeBoxEditor: Typeblox | null;
}

declare global {
  interface Window {
    typebloxEditor?: Typeblox;
  }
}

export class EditorProvider extends Component<
  EditorProviderProps,
  EditorProviderState
> {
  constructor(props: EditorProviderProps) {
    super(props);

    this.state = {
      TypeBoxEditor: null,
    };
  }

  componentDidMount() {
    this.initializeEditor();
  }

  componentDidUpdate(prevProps: EditorProviderProps) {
    // if (
    //   prevProps.content !== this.props.content ||
    //   prevProps.onChange !== this.props.onChange
    // ) {
    //   this.reinitializeEditor();
    // }
  }

  componentWillUnmount() {
    this.cleanupEditor();
  }

  initializeEditor() {
    const { content, onChange, onImageUpload, extensions } = this.props;

    try {
      const editor = new Typeblox();
      editor.init({
        HTMLString: content,
        onUpdate: onChange,
        onImageUpload,
        extensions,
      });

      console.warn("Editor initialized:", editor.blox().getBlox());

      // Register editor instance globally for debugging (optional)
      window.typebloxEditor = editor;

      this.setState({ TypeBoxEditor: editor });
    } catch (error) {
      console.error("Failed to initialize Typeblox editor:", error);
    }
  }

  reinitializeEditor() {
    this.cleanupEditor();
    this.initializeEditor();
  }

  cleanupEditor() {
    try {
      if (this.state.TypeBoxEditor) {
        this.state.TypeBoxEditor.destroy?.();
        if (window.typebloxEditor === this.state.TypeBoxEditor) {
          delete window.typebloxEditor;
        }
      }
    } catch (error) {
      console.error("Failed to destroy Typeblox editor:", error);
    } finally {
      this.setState({ TypeBoxEditor: null });
    }
  }

  render() {
    const { TypeBoxEditor } = this.state;
    const {
      children,
      slotBefore,
      toolbars,
      menus,
      extensions = {},
      onChange,
      onImageUpload,
    } = this.props;

    if (!TypeBoxEditor) {
      return <div>Loading editor...</div>;
    }

    return (
      <EditorContext.Provider
        value={{
          editor: TypeBoxEditor,
          onChange,
          onImageUpload,
        }}
      >
        <div>
          {slotBefore && <div>{slotBefore}</div>}
          <Editor toolbars={toolbars} extensions={extensions} menus={menus} />
          {children}
        </div>
      </EditorContext.Provider>
    );
  }
}

export default EditorProvider;
