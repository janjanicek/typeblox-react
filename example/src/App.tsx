// example/App.jsx

import React from "react";
import { EVENTS } from "@typeblox/core/dist/constants";
import { useEffect, useState } from "react";
import { EditorProvider, useEditor } from "@typeblox/react";

const MenuBar = () => {
  const { editor } = useEditor();

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
    <div className="control-group">
      <div className="flex gap-2 p-5">
        <button
          onClick={() => {
            editor.getCurrentBlock()?.toggleBold();
          }}
          className={`${
            activeStyle.isBold ? "bg-blue-500" : "bg-gray-300"
          } ' hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
        >
          Bold
        </button>
        <button
          onClick={() => {
            editor.getCurrentBlock()?.toggleItalic();
          }}
          className={`${
            activeStyle.isItalic ? "bg-blue-500" : "bg-gray-300"
          } ' hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
        >
          Italic
        </button>
        <button
          onClick={() => {
            editor.getCurrentBlock()?.toggleStrike();
          }}
          className={`${
            activeStyle.isStrikeout ? "bg-blue-500" : "bg-gray-300"
          } ' hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
        >
          Strike
        </button>
        <button
          onClick={() => {
            editor.getCurrentBlock()?.toggleUnderline();
          }}
          className={`${
            activeStyle.isUnderline ? "bg-blue-500" : "bg-gray-300"
          } ' hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
        >
          Underline
        </button>
        <button
          onClick={() => {
            editor.getCurrentBlock()?.toggleType("headline1");
          }}
          className={`${
            activeStyle.isH1 ? "bg-blue-500" : "bg-gray-300"
          } ' hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
        >
          H1
        </button>
        <button
          onClick={() => {
            editor.getCurrentBlock()?.toggleType("headline2");
          }}
          className={`${
            activeStyle.isH2 ? "bg-blue-500" : "bg-gray-300"
          } ' hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
        >
          H2
        </button>
        <button
          onClick={() => editor.getCurrentBlock()?.toggleType("headline3")}
          className={`${
            activeStyle.isH3 ? "bg-blue-500" : "bg-gray-300"
          } ' hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
        >
          H3
        </button>
        <button
          onClick={() => editor.getCurrentBlock()?.toggleType("text")}
          className={`${
            activeStyle.isParagraph ? "bg-blue-500" : "bg-gray-300"
          } ' hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.getCurrentBlock()?.toggleType("code")}
          className={`${
            activeStyle.isCode ? "bg-blue-500" : "bg-gray-300"
          } ' hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
        >
          Code
        </button>
        <button
          onClick={() => editor.handleUndo()}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Undo
        </button>
        <button
          onClick={() => editor.handleRedo()}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Redo
        </button>
        <button
          onClick={() => editor.format().clearFormat()}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

function App() {
  const sampleContent = `
  <h1 style="font-family: 'Helvetica Neue'; font-size: 20px; font-weight: bold;">How to Start Using Usetiful</h1>
  <p style="font-family: 'Helvetica Neue'; font-size: 14px; line-height: 1.5;">
    Usetiful helps you create engaging user onboarding experiences in a few simple steps.
  </p>
  <h2 style="font-family: 'Helvetica Neue'; font-size: 18px; font-weight: bold;">Steps to Get Started:</h2>
  <ol style="font-family: 'Helvetica Neue'; font-size: 14px; line-height: 1.5;">
    <li>Install the script on your website.</li>
    <li>
      <a href="https://help.usetiful.com/create" target="_blank" style="color: #387dff; text-decoration: none;">
        Create and preview your first tour.
      </a>
    </li>
    <li>
      <a href="https://help.usetiful.com/publish" target="_blank" style="color: #387dff; text-decoration: none;">
        Publish your tour and go live.
      </a>
    </li>
  </ol>
  <p style="font-family: 'Helvetica Neue'; font-size: 14px; line-height: 1.5;">
    <strong style="font-weight: bold;">Note:</strong> Ensure the script is added to all relevant pages to enable tours.
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <iframe 
      src="https://www.youtube.com/embed/C4yT3jo1If4" 
      width="640" 
      height="360" 
      frameborder="0" 
      allowfullscreen 
      style="border: none; max-width: 100%;"
    ></iframe>
  </div>
  <p style="font-family: 'Helvetica Neue'; font-size: 14px; line-height: 1.5;">
    <strong style="font-weight: bold;">Need Help?</strong> Visit our 
    <a href="https://help.usetiful.com" target="_blank" style="color: #387dff; text-decoration: none;">
      Help Center
    </a> for detailed instructions.
  </p>
`;

  const onChangeHandler = (updatedHTMLString: string) => {
    sessionStorage.setItem("tempEditorContent", updatedHTMLString);
  };
  
  return (
    <>
        <EditorProvider
          slotBefore={<MenuBar />}
          content={String(sessionStorage.getItem("tempEditorContent") ?? sampleContent)}
          onChange={onChangeHandler}
        ></EditorProvider>
    </>
  );
}

export default App;
