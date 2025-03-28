import { EVENTS } from "@typeblox/core/dist/constants";
import { EditorProvider, useTypebloxEditor } from "@typeblox/react";
import React, { useEffect, useState } from "react";
import HeadlessEditorProvider from "./HeadlessEditorProvider";

const MenuBar = ({style}) => {
  // State to track the current styles

  const { editor } = useTypebloxEditor();

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

  interface TopbarProps {
    theme: string;
  }
  
  const Headless: React.FC<TopbarProps> = ({theme}) => {
  
    // const sampleContent = "some text";
    const sampleContent = `
    <h1>Welcome to Typeblox Editor 👋</h1>
    <p><a href="https://www.typeblox.com">Typeblox</a> is a <i>powerful</i> and <b>flexible</b> headless editor built with TypeScript. Designed to integrate seamlessly with any JavaScript framework, Typeblox empowers developers to create rich, content-driven applications with ease.</p>
    
    <h2>Key Features</h2>
    <ul>
      <li><b>Rich Text Editing:</b> Apply styles like bold, italic, underline, and more.</li>
      <li><b>Lists:</b> Create ordered and unordered lists to organize your content.</li>
      <li><b>Media Embedding:</b> Easily embed images and videos to enhance your articles.</li>
      <li><b>Code Blocks:</b> Insert and display code snippets with proper formatting.</li>
    </ul>
    
    <h3>Blockquote Example</h3>
    <blockquote>
      "Typeblox revolutionizes how we handle content editing in modern web applications."
    </blockquote>
    
    <h3>Code Block Example</h3>
   <code>function greet(name) {
      console.log(\`Hello, \${name}!\`);
    }
    
    greet('Typeblox');
    </code>
    
    <p>As demonstrated, Typeblox provides a robust set of features that cater to diverse content creation needs. Whether you're building a blog, a documentation site, or any content-rich application, Typeblox offers the flexibility and power you need.</p>
    `;
    
  
    const onChangeHandler = (updatedHTMLString: string) => {
      sessionStorage.setItem("tempEditorContent-headless", updatedHTMLString);
    };
  
    // const AlignLeft = () => {
    //   const { editor } = useTypebloxEditor();
    //   return (
    //   <button onClick={()=>{
    //     editor.blox().getCurrentBlock()?.setStyle('text-align', 'left');
    //   }}>⬅ Align left</button>
    //   )
    // };
    
    return (
      <>
          <HeadlessEditorProvider content={String(sessionStorage.getItem("tempEditorContent-headless") ?? sampleContent)}
            onChange={onChangeHandler} extensions={[]}/>

          {/* <EditorProvider
            // toolbars={{
            //   text: 'add drag | bold italic underline strikethrough | font | color bgColor | newModule',
            //   image: 'replaceImage | align'
            // }}
            menus={{
              block: []
            }}
            className="content"
            content={String(sessionStorage.getItem("tempEditorContent-headless") ?? sampleContent)}
            onChange={onChangeHandler}
            slotBefore={<MenuBar style={{marginBottom: '20px'}} />}
            editorSettings={{
              theme,
              toolbarPosition: 'bottom',
              toolbarType: 'bar'
            }}
            extensions={[
              {
                name: "alignLeft",
                onClick: () => {
                  (window as any).typebloxEditor?.blox().getCurrentBlock()?.toggleStyle('text-align', 'left');
                },
                isActive: () => (window as any).typebloxEditor?.style().getStyle().textAlign === "left",
                icon: "alignLeft",
              },
              {
                name: "alignCenter",
                onClick: () => {
                  (window as any).typebloxEditor?.blox().getCurrentBlock()?.toggleStyle('text-align', 'center');
                },
                isActive: () => (window as any).typebloxEditor?.style().getStyle().textAlign === "center",
                icon: "alignCenter",
              },
              {
                name: "newModule",
                onClick: () => {
                  console.log("clicked");
                },
                isActive: () => {},
                iconElement: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round">
                    <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path>
                  </svg>
                )
              },
            ]}
            // blocks={{
            //   code: {
            //     defaults: {
            //       styles: 'color: red;'
            //     }
            //   },
            //   headline1: {
            //     defaults: {
            //       styles: 'color: red;'
            //     }
            //   },
            //   headline4: {
            //     tag: "h4",
            //     visibleName: "Headline 4",
            //     blockName: "headline4",
            //     description: "This is a sample block description",
            //     placeholder: "Write your content",
            //     iconElement: (
            //       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round">
            //         <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path>
            //       </svg>
            //     ),
            //   }
            // }}
            ></EditorProvider> */}
            </>
    );
};

export default Headless;