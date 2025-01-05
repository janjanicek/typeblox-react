import React from "react";
import Icon from "../Icon";
import useBlockStore from "../../stores/BlockStore";
import { useEditor } from "../../utils/EditorContext";

export const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedCodeLanguage, setSelectedCodeLanguage } = useBlockStore();
  // const { applyFormatting } = useEditor();

  // TODO:   const handleChangeLanguage = (language: string) => {
  //     setSelectedCodeLanguage(language);
  //     applyFormatting("code", { language });
  //   };

  const copyToClipboard = () => {
    if (children) {
      navigator.clipboard.writeText(children.toString()).then(
        () => {
          console.log("Code copied to clipboard!");
        },
        (err) => {
          console.error("Failed to copy code: ", err);
        },
      );
    }
  };

  return (
    <div className="code-block">
      <span className="language-label">{selectedCodeLanguage}</span>
      <button className="copy-button" onClick={copyToClipboard}>
        <Icon src="icons/copy.svg" alt="Copy Code" />
        Copy code
      </button>
      <pre>{children}</pre> // Uvnitr bude code
    </div>
  );
};
