// example/App.jsx

import React from "react";
import { EVENTS } from "@typeblox/core/dist/constants";
import { useEffect, useState } from "react";
import { EditorProvider, useTypebloxEditor } from "@typeblox/react";

const MenuBar = ({style}) => {
  const { editor } = useTypebloxEditor();

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
      <div className="flex gap-2 p-5" style={{flexWrap: 'wrap'}}>
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
          onClick={() => editor.handleUndo()}
          className="tbx-button"
        >
          Undo
        </button>
        <button
          onClick={() => editor.handleRedo()}
          className="tbx-button"
        >
          Redo
        </button>
        <button
          onClick={() => editor.style().clearFormat()}
          className="tbx-button"
        >
          Clear
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

function App() {

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
  
  <h3>Embedding Media</h3>
  <img src="https://images.unsplash.com/photo-1577900258307-26411733b430?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Scenic View" />
  <p style="text-align: center"><i>Photo by <a href="https://unsplash.com/@ameliabartlett?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Amelia Bartlett</a> on <a href="https://unsplash.com/photos/macbook-pro-OgT83CPGbQI?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></i></p>
  
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
    sessionStorage.setItem("tempEditorContent", updatedHTMLString);
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
    <div style={{padding: '20px'}}>
        <EditorProvider
          // toolbars={{
          //   text: 'add drag | bold italic underline strikethrough | font | color bgColor | newModule',
          //   image: 'replaceImage | align'
          // }}
          // menus={{
          //   block: ["add", "drag"]
          // }}
          slotBefore={<MenuBar style={{marginBottom: '40px'}} />}
          content={String(sessionStorage.getItem("tempEditorContent") ?? sampleContent)}
          onChange={onChangeHandler}
          extensions={[
            {
              name: "alignLeft",
              onClick: () => {
                (window as any).typebloxEditor?.blox().getCurrentBlock()?.toggleStyle('text-align', 'left');
              },
              isActive: () => (window as any).typebloxEditor?.style().getStyle().textAlign === "left",
              iconName: "alignLeft",
            },
            {
              name: "alignCenter",
              onClick: () => {
                (window as any).typebloxEditor?.blox().getCurrentBlock()?.toggleStyle('text-align', 'center');
              },
              isActive: () => (window as any).typebloxEditor?.style().getStyle().textAlign === "center",
              iconName: "alignCenter",
            },
            {
              name: "alignRight",
              onClick: () => {
                (window as any).typebloxEditor?.blox().getCurrentBlock()?.toggleStyle('text-align', 'right');
              },
              isActive: () => (window as any).typebloxEditor?.style().getStyle().textAlign === "right",
              iconName: "alignRight",
            },
          ]}
          

        ></EditorProvider>
    </div>
  );
}

export default App;
