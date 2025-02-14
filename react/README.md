# Typeblox Editor

Simple React block-based WYSIWYG editor

# Usage

To use the `<EditorProvider />` component, simply import it and configure its properties. Below is an example:

```jsx
import { EditorProvider, useTypebloxEditor } from "@typeblox/react";

const sampleContent = `
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
</ul>`;

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
      theme="dark" // or light
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
```

## License

This package is licensed under Apache License 2.0 + Commons Clause. See the License file.
