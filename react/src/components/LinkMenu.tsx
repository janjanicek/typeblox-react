import React, { useEffect, useRef, useState } from "react";
import { useTypebloxEditor } from "../context/EditorContext";

interface LinkMenuProps {
  onChange: (url: string, target: string) => void;
}

const LinkMenu: React.FC<LinkMenuProps> = ({ onChange }) => {
  const [url, setUrl] = useState("");
  const [target, setTarget] = useState("_blank");
  const { editor } = useTypebloxEditor();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectionRef = useRef<Range | null>(null);
  const [isLinkUpdate, setIsLinkUpdate] = useState<boolean>(false);

  useEffect(() => {
    // Save selection BEFORE opening the menu
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selectionRef.current = selection.getRangeAt(0);
    }

    const linkProps = editor.link().getLinkProps();
    if (linkProps) {
      setUrl(linkProps.href);
      if (linkProps.href) setIsLinkUpdate(true);
      setTarget(linkProps.target);
    }

    // Delay input focus to avoid losing selection
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const restoreSelection = () => {
    if (selectionRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(selectionRef.current);
    }
  };

  return (
    <div className="p-2">
      <input
        ref={inputRef}
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste URL here"
        className="border p-2 mb-2 block w-full"
      />
      <p className="flex items-baseline">
        <input
          type="checkbox"
          checked={target === "_blank"}
          onChange={(e) => {
            setTarget(e.target.checked ? "_blank" : "_self");
          }}
          className="mr-2 mb-3"
        />
        Open in a new tab
      </p>
      <div className="flex justify-between">
        <button
          onClick={() => {
            restoreSelection();
            onChange(url, target);
          }}
          className="tbx-bg-primary text-white px-4 py-2 rounded"
        >
          {!isLinkUpdate ? "Place link" : "Update link"}
        </button>
        {isLinkUpdate && (
          <button
            onClick={() => {
              restoreSelection();
              onChange("", "");
            }} // Empty URL removes link
            className="text-red-500 border border-red-500 px-4 py-2 rounded"
          >
            Unlink
          </button>
        )}
      </div>
    </div>
  );
};

export default LinkMenu;
