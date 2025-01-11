import Icon from "../../components/Icon";
import React from "react";
import useBlockStore from "../../stores/BlockStore";

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
        <Icon name="code" />
        Copy code
      </button>
      <pre>{children}</pre> // Uvnitr bude code
    </div>
  );
};
