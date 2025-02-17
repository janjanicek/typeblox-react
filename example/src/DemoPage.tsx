import React, { useState } from "react";
import Code from "./components/Code";
import Headless from "./components/Headless";
import Inline from "./components/Inline";
import Topbar from "./components/Topbar";

interface DemoPageProps {
    demoType: "headless" | "inline" | "topbar";
  }

const DemoPage: React.FC<DemoPageProps> = ({demoType}) => {
    const [activeTab, setActiveTab] = useState("editor");
    const [theme, setTheme] = useState("light");
  
    const onChangeHandler = (updatedHTMLString: string) => {
      sessionStorage.setItem(`tempEditorContent-${demoType}`, updatedHTMLString);
    };

    const renderDemoComponent = (type) => {
        switch (type) {
            case "inline":
                return <Inline theme={theme} />;
            case "topbar":
                return <Topbar theme={theme} />;
            default:
                return <Headless theme={theme} />;
        }
    };
    
    
    return (
    <div data-theme={theme}>
    <div className="tabs simple">
        <button onClick={() => window.open('/inline', "_self") } className={`${demoType === "inline" ? "active" : ""} button`}>
        Inline
        </button>
        <button onClick={() => window.open('/topbar', "_self") } className={`${demoType === "topbar" ? "active" : ""} button`}>
        Menu bar
        </button>
        <button onClick={() => window.open('/headless', "_self") } className={`${demoType === "headless" ? "active" : ""} button`}>
        Headless
        </button>
    </div>
      <div style={{padding: '0px 20px'}}>
         <div style={{display: 'flex', justifyContent: 'space-between'}}>

        <div className="tabs">
          <button onClick={() => setActiveTab("editor")} className={`${activeTab === "editor" ? "active" : ""} button`}>
            Editor
          </button>
          <button onClick={() => {
            const currentContent = (window as any).typebloxEditor?.getCurrentDOM();
            if(currentContent) onChangeHandler(currentContent);
            setActiveTab("preview")
          }} className={`${activeTab === "preview" ? "active" : ""} button`}>
            Preview
          </button>
          <button onClick={() => setActiveTab("code")} className={`${activeTab === "code" ? "active" : ""} button`}>
            Code
          </button>
        </div>

        <div style={{display: 'flex'}}>
        <div className="tabs small">
          <button onClick={() => setTheme("light")} className={`${theme === "light" ? "active" : ""} button`}>
            <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/></svg>
          </button>
          <button onClick={() => setTheme("dark")} className={`${theme === "dark" ? "active" : ""} button`}>
            <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
        </div>
        </div>

        </div>
  
        {activeTab === "editor" && renderDemoComponent(demoType)}
        {activeTab === "preview" && (
          <div className="content" id="preview" dangerouslySetInnerHTML={{ __html: sessionStorage.getItem(`tempEditorContent-${demoType}`) }}></div>
        )}
        {activeTab === "code" && (
         <Code activeTab={demoType === 'headless' ? "js": "react"} />
        )}
      </div>
      </div>
    );
};

export default DemoPage;