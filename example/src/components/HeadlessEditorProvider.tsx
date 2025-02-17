import React, { useEffect, useRef, useState } from "react";
import Typeblox from "@typeblox/core";
import { EVENTS } from "@typeblox/core/dist/constants";

const MenuBar = ({style, editor}) => {
    // State to track the current styles
    const [activeStyle, setActiveStyle] = useState(editor.getSelectionStyle());
  
    useEffect(() => {
      if (!editor) return;
  
      // Handler to update state on style changes
      const handleStyleChange = () => {
        setActiveStyle(editor.getSelectionStyle());
      };
      editor.on(EVENTS.selectionChange, handleStyleChange);
      handleStyleChange();
  
      return () => {
        editor.off(EVENTS.selectionChange, handleStyleChange);
      };
    }, [editor]);
  
    if (!editor) {
      return null;
    }
  
    // catchStyleChange and update Style.
  
    return (
      <div className="control-group" style={style}>
        <div style={{flexWrap: 'wrap', gap: '.5rem', display: 'flex'}}>
          <button
            onClick={() => {
              editor.blox().getCurrentBlock()?.toggleBold();
            }}
            className={`${
              activeStyle.isBold ? "tbx-active" : ""
            } tbx-button`}
          >
            Bold
          </button>
          <button
            onClick={() => {
              editor.blox().getCurrentBlock()?.toggleItalic();
            }}
            className={`${
              activeStyle.isItalic ? "tbx-active" : ""
            } tbx-button`}
          >
            Italic
          </button>
          <button
            onClick={() => {
              editor.blox().getCurrentBlock()?.toggleStrike();
            }}
            className={`${
              activeStyle.isStrikeout ? "tbx-active" : ""
            } tbx-button`}
          >
            Strike
          </button>
          <button
            onClick={() => {
              editor.blox().getCurrentBlock()?.toggleUnderline();
            }}
            className={`${
              activeStyle.isUnderline ? "tbx-active" : ""
            } tbx-button`}
          >
            Underline
          </button>
          <button
            onClick={() => {
              editor.blox().getCurrentBlock()?.toggleType("headline1");
            }}
            className={`${
              activeStyle.isH1 ? "tbx-active" : ""
            } tbx-button`}
          >
            H1
          </button>
          <button
            onClick={() => {
              editor.blox().getCurrentBlock()?.toggleType("headline2");
            }}
            className={`${
              activeStyle.isH2 ? "tbx-active" : ""
            } tbx-button`}
          >
            H2
          </button>
          <button
            onClick={() => editor.blox().getCurrentBlock()?.toggleType("headline3")}
            className={`${
              activeStyle.isH3 ? "tbx-active" : ""
            } tbx-button`}
          >
            H3
          </button>
          <button
            onClick={() => editor.blox().getCurrentBlock()?.toggleType("text")}
            className={`${
              activeStyle.isParagraph ? "tbx-active" : ""
            } tbx-button`}
          >
            Paragraph
          </button>
          <button
            onClick={() => editor.blox().getCurrentBlock()?.toggleType("code")}
            className={`${
              activeStyle.isCode ? "tbx-active" : ""
            } tbx-button`}
          >
            Code
          </button>
          <button
            onClick={() => editor.history().undo()}
            className="tbx-button"
            disabled={!editor.history().isUndoAvailable()}
          >
            Undo
          </button>
          <button
            onClick={() => editor.history().redo()}
            className="tbx-button"
            disabled={!editor.history().isRedoAvailable()}
          >
            Redo
          </button>
          <button
            onClick={() => editor.style().clearFormat()}
            className="tbx-button"
          >
            Clear style
          </button>
          <button
            onClick={() => editor.blox().getCurrentBlock()?.setStyle('text-align', 'left')}
            className={`${
              activeStyle.textAlign === 'left' ? "tbx-active" : ""
            } tbx-button`}
          >
            Align left
          </button>
          <button
            onClick={() => editor.blox().getCurrentBlock()?.setStyle('text-align', 'center')}
            className={`${
              activeStyle.textAlign === 'center' ? "tbx-button" : ""
            } tbx-button`}
          >
            Align center
          </button>
          <button
            onClick={() => editor.blox().getCurrentBlock()?.setStyle('text-align', 'right')}
            className={`${
              activeStyle.textAlign === 'right' ? "tbx-button" : ""
            } tbx-button`}
          >
            Align right
          </button>
        </div>
      </div>
    );
  };

const HeadlessEditorProvider = ({ content, onChange, extensions }) => {
  const [editor, setEditor] = useState(null);
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;

    try {
      const typebloxEditor = new Typeblox();
      typebloxEditor.init({ HTMLString: content, onUpdate: onChange, extensions });
      editorRef.current = typebloxEditor;
      setEditor(typebloxEditor);
    } catch (error) {
      console.error("Failed to initialize Typeblox editor:", error);
    }

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
      setEditor(null);
    };
  }, [content, onChange]);

  useEffect(() => {
    if(editor && editorContainerRef.current){
    //editor.prepareEditor(editorContainerRef.current);
    }
  }, [editor, editorContainerRef]);

  return editor ? <>{<MenuBar editor={editor} style={{padding: '10px'}} />}<div id="typeblox-editor" className="content" ref={editorContainerRef} contentEditable={true} dangerouslySetInnerHTML={{ __html: content }}></div></> : <div>Loading editor...</div>;
};

export default HeadlessEditorProvider;