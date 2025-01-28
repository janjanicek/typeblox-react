# Typeblox Editor

Simple React block-based WYSIWYG editor

# Usage

To use the `<EditorProvider />` component, simply import it and configure its properties. Below is an example:

```jsx
import { EditorProvider } from "./utils/EditorContext";

const sampleContent = `
<h1>Welcome to Typeblox Editor</h1>
<p><strong>Start creating</strong> amazing content with this simple WYSIWYG editor!</p>
<ul>
    <li>Use <strong>bold</strong>, <em>italic</em>, and <u>underline</u> text formatting.</li>
    <li>Change text color and background color.</li>
    <li>Create lists, headings, and more!</li>
</ul>
`;

const onChangeHandler = (updatedHTMLString: string) => {
  sessionStorage.setItem("tempEditorContent", updatedHTMLString);
};

<EditorProvider
  init={{
    toolbars={{
      text: 'bold italic underline strikethrough | font | color bgColor | newModule',
      image: 'replaceImage | alignLeft alignCenter alignRight'
    }}
    slotBefore={<MenuBar style={{marginBottom: '40px'}} />}
    content={sampleContent}
    onChange={onChangeHandler}
    extensions={[
      {
        name: "newModule",
        onClick: () => {
          window.typebloxEditor?.blox().getCurrentBlock()?.toggleStyle('text-align', 'left');
        },
        isActive: () => window.typebloxEditor?.style().getStyle().textAlign === "left",
        iconName: "alignLeft", // Icons from https://tabler.io/
      }]}
  }}
  content={sampleContent}
></EditorProvider>;
```

## License

This package is licensed under Apache License 2.0 + Commons Clause. See the License file.
