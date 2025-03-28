import { EditorProvider } from "@typeblox/react";
import React from "react";

interface InlineProps {
    theme: string;
}

const Inline: React.FC<InlineProps> = ({theme}) => {

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
      sessionStorage.setItem("tempEditorContent-inline", updatedHTMLString);
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
          <EditorProvider
            // toolbars={{
            //   text: 'add drag | bold italic underline strikethrough | font | color bgColor | newModule',
            //   image: 'replaceImage | align'
            // }}
            // menus={{
            //   block: ["add", "drag"]
            // }}
            className="content"
            content={String(sessionStorage.getItem("tempEditorContent-inline") ?? sampleContent)}
            onChange={onChangeHandler}
            editorSettings={{
              theme,
              toolbarPosition: 'top',
              toolbarType: 'inline',
              toolbarTarget: 'editor',
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
            ></EditorProvider>
    );
};

export default Inline;