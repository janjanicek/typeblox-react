import React, { useEffect, useState } from "react";
import { createHighlighter } from "shiki/index.mjs";

const Code = ({ activeTab }) => {
    const [activeCodeTab, setActiveCodeTab] = useState(activeTab);
    const [highlightedCode, setHighlightedCode] = useState("");
    const [highlightedReactCode, setHighlightedReactCode] = useState("");

    const code = `import { Typeblox } from "@typeblox/core";
  
    const TypeBoxEditor = new Typeblox();
    
    const sampleContent = \`
    <h1>Welcome to Typeblox Editor 👋</h1>
    <p><a href="https://www.typeblox.com">Typeblox</a> is a <i>powerful</i> and <b>flexible</b> headless editor built with TypeScript. 
    Designed to integrate seamlessly with any JavaScript framework, Typeblox empowers developers to create rich, 
    content-driven applications with ease.</p>
    
    <h2>Key Features</h2>
    <ul>
      <li><b>Rich Text Editing:</b> Apply styles like bold, italic, underline, and more.</li>
      <li><b>Lists:</b> Create ordered and unordered lists to organize your content.</li>
      <li><b>Media Embedding:</b> Easily embed images and videos to enhance your articles.</li>
      <li><b>Code Blocks:</b> Insert and display code snippets with proper formatting.</li>
    </ul>\`;
    
    const onChange = () => {
        // your code for updating content
    }
    
    TypeBoxEditor.init({
      HTMLString: sampleContent,
      onUpdate: onChange,
      extensions: [ // You can define your own modules
          {
            name: "newExtension",
            onClick: () => {
              (window as any).typebloxEditor?.blox().getCurrentBlock()?.toggleStyle('text-align', 'left');
            },
            isActive: () => (window as any).typebloxEditor?.style().getStyle().textAlign === "left",
            iconElement: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round">
                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path>
              </svg>
            ),
          },
      ],
      blocks: { // Apply some default styling to blocks
          headline1: {
            defaults: {
              styles: "color: red;"
            }
          },
          customBlock: { // Define custom block
            tag: "div",
            visibleName: "My block",
            blockName: "customBlock",
            description: "This is a sample block description",
            placeholder: "Write your content",
            iconElement: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round">
                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path>
              </svg>
            ),
          }
      }
    });
    
    console.log(TypeBoxEditor.blox().getBlox()); // To see instances of blocks
    
    // Examples of operations
    
    TypeBoxEditor.blox().getCurrentBlock()?.toggleBold(); //toggles the bold style on the selection text
    
    TypeBoxEditor.blox().getCurrentBlock()?.toggleItalic(); //toggles the bold style on the selection
    
    TypeBoxEditor.blox().getCurrentBlock()?.toggleType("headline1"); //change the type of the block to h1
    
    TypeBoxEditor.format().clearFormat(); //clears the text style`;
    
      const reactCode = `import { EditorProvider, useTypebloxEditor } from "@typeblox/react";
    
    const sampleContent = \`
    <h1>Welcome to Typeblox Editor 👋</h1>
    <p><a href="https://www.typeblox.com">Typeblox</a> is a <i>powerful</i> and <b>flexible</b> headless editor built with TypeScript. 
    Designed to integrate seamlessly with any JavaScript framework, Typeblox empowers developers to create rich, 
    content-driven applications with ease.</p>
    
    <h2>Key Features</h2>
    <ul>
      <li><b>Rich Text Editing:</b> Apply styles like bold, italic, underline, and more.</li>
      <li><b>Lists:</b> Create ordered and unordered lists to organize your content.</li>
      <li><b>Media Embedding:</b> Easily embed images and videos to enhance your articles.</li>
      <li><b>Code Blocks:</b> Insert and display code snippets with proper formatting.</li>
    </ul>\`;
    
    const CustomToolbar = () => {
      const { editor } = useTypebloxEditor();
    
      return (
        <div className="toolbar">
            <button
              onClick={() => {
                editor.blox().getCurrentBlock()?.toggleBold();
              }}
            >
              Bold
            </button>
        </div>
      );
    };
    
    function App() { // Sample App component
      const onChangeHandler = (updatedHTMLString: string) => {
        sessionStorage.setItem("tempEditorContent", updatedHTMLString); // This sample function saves the updated content into the sessionStorage
      };
    
      return (
        <EditorProvider
          toolbars={{
            text: 'add drag | bold italic underline strikethrough | font | color bgColor | newExtension',
            image: 'replaceImage | align' 
            // If not specified, default settings is used
          }}
          menus={{
            block: ["add", "drag"] // Define actions visible on the left when hovering blocks
          }}
          slotBefore={<CustomToolbar />} // You can put above the editor your own toolbar
          className="content" // Add classes to the editor container
          content={String(sessionStorage.getItem("tempEditorContent") ?? sampleContent)}
          onChange={onChangeHandler}
          editorSettings={{
            theme: 'light', // or dark
            toolbarPosition: 'top', // position of the toolbar
            toolbarType: 'bar', // type of the toolbar can be 'bar' or 'inline'
            toolbarStyle: {borderTopRightRadius: '5px', borderTopLeftRadius: '5px'},
            containerStyle: { border: "1px solid #c1c1c1", borderRadius: "6px" }
          }}
          extensions={[ // You can define your own modules
            {
              name: "newExtension",
              onClick: () => {
                (window as any).typebloxEditor?.blox().getCurrentBlock()?.toggleStyle('text-align', 'left');
              },
              isActive: () => (window as any).typebloxEditor?.style().getStyle().textAlign === "left",
              iconElement: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round">
                  <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path>
                </svg>
              ),
            },
        ]}
        blocks={{ // Apply some default styling to blocks
            headline1: {
              defaults: {
                styles: "color: red;"
              }
            },
            customBlock: { // Define custom block
              tag: "div",
              visibleName: "My block",
              blockName: "customBlock",
              description: "This is a sample block description",
              placeholder: "Write your content",
              iconElement: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round">
                  <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path>
                </svg>
              ),
            }
        }}>
        </EditorProvider>
      );
    }
      `;

    useEffect(() => {
        async function highlightCode() {
            const highlighter = await createHighlighter({
                themes: ["github-dark-default"],
                langs: ["javascript"],
            });

            const html = await highlighter.codeToHtml(code, {
                lang: "javascript",
                theme: "github-dark-default",
            });

            const htmReact = await highlighter.codeToHtml(reactCode, {
                lang: "javascript",
                theme: "github-dark-default",
            });

            setHighlightedCode(html);
            setHighlightedReactCode(htmReact);
        }

        highlightCode();
    }, [code, reactCode]);

    return (
        <div id="code">
            <div className="tabs">
                <button onClick={() => setActiveCodeTab("react")} className={`${activeCodeTab === "react" ? "active" : ""} button`}>
                    React
                </button>
                <button onClick={() => setActiveCodeTab("js")} className={`${activeCodeTab === "js" ? "active" : ""} button`}>
                    Vanilla JS
                </button>
                <button className="button" disabled>
                    Vue.js (coming soon)
                </button>
            </div>
            {activeCodeTab === "js" && (
                <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            )}
            {activeCodeTab === "react" && (
                <div dangerouslySetInnerHTML={{ __html: highlightedReactCode }} />
            )}
        </div>
    );
};

export default Code;
