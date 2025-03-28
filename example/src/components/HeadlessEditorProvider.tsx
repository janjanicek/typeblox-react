import React, { useEffect, useRef, useState } from "react";
import Typeblox from "@typeblox/core";

const HeadlessEditorProvider = ({ content, onChange, extensions }) => {

    const isEditorInitialized = useRef(false);
    
    useEffect(() => {
        if (!isEditorInitialized.current && document.getElementById("typeblox-editor")) {
            try {

                const typebloxEditor = new Typeblox();
                typebloxEditor.init({
                    HTMLString: content,
                    onUpdate: onChange,
                    extensions,
                    editorContainer: "#typeblox-editor",
                });

                window.typebloxEditor = typebloxEditor;
                isEditorInitialized.current = true;
            } catch (error) {
                console.error("Failed to initialize Typeblox editor:", error);
            }
        }

        return () => {

            console.log("Cleaning up Typeblox...");

            if (isEditorInitialized.current && window.typebloxEditor) {
                window.typebloxEditor.destroy();
                window.typebloxEditor = null;
                isEditorInitialized.current = false;
            }
        };
    }, []); // Dependencies

    return (
        <>
            <div className="control-group" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", paddingBottom: '20px' }}>
                <button onClick={() => {
                    console.warn(window.typebloxEditor?.blox().getCurrentBlock());
                    window.typebloxEditor?.blox().getCurrentBlock()?.toggleBold()}
                 } className="tbx-button">
                    Bold
                </button>
                <button onClick={() => window.typebloxEditor?.blox().getCurrentBlock()?.toggleItalic()} className="tbx-button">
                    Italic
                </button>
                <button onClick={() => window.typebloxEditor?.blox().getCurrentBlock()?.toggleStrike()} className="tbx-button">
                    Strike
                </button>
                <button onClick={() => window.typebloxEditor?.blox().getCurrentBlock()?.toggleUnderline()} className="tbx-button">
                    Underline
                </button>
                <button onClick={() => window.typebloxEditor?.blox().getCurrentBlock()?.toggleType("headline1")} className="tbx-button">
                    H1
                </button>
                <button onClick={() => window.typebloxEditor?.blox().getCurrentBlock()?.toggleType("headline2")} className="tbx-button">
                    H2
                </button>
                <button onClick={() => window.typebloxEditor?.blox().getCurrentBlock()?.toggleType("headline3")} className="tbx-button">
                    H3
                </button>
                <button onClick={() => window.typebloxEditor?.blox().getCurrentBlock()?.toggleType("code")} className="tbx-button">
                    Code Block
                </button>
                <button onClick={() => window.typebloxEditor?.history().undo()} className="tbx-button" disabled={!window.typebloxEditor?.history().isUndoAvailable()}>
                    Undo
                </button>
                <button onClick={() => window.typebloxEditor?.history().redo()} className="tbx-button" disabled={!window.typebloxEditor?.history().isRedoAvailable()}>
                    Redo
                </button>
                <button onClick={() => window.typebloxEditor?.style().clearFormat()} className="tbx-button">
                    Clear Style
                </button>
                <button onClick={() => window.typebloxEditor?.blox().getCurrentBlock()?.setStyle("text-align", "left")} className="tbx-button">
                    Align Left
                </button>
                <button onClick={() => window.typebloxEditor?.blox().getCurrentBlock()?.setStyle("text-align", "center")} className="tbx-button">
                    Align Center
                </button>
                <button onClick={() => window.typebloxEditor?.blox().getCurrentBlock()?.setStyle("text-align", "right")} className="tbx-button">
                    Align Right
                </button>
            </div>

            <div id="typeblox-editor" className="content" contentEditable={true}></div>
        </>
    );
};

export default HeadlessEditorProvider;
