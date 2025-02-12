import React, { useEffect, useRef, useState } from "react";
import { useTypebloxEditor } from "../../context/EditorContext";
import Icon from "../../components/Icon";
import ContextualMenu from "../../components/menus/ContextualMenu";
import LinkMenu from "../../components/menus/LinkMenu";
import Tooltip from "../../components/Tooltip";

interface ModuleProps {
  isMenu?: boolean;
}

export const Link: React.FC<ModuleProps> = ({ isMenu = false }) => {
  const { editor } = useTypebloxEditor();
  const [isLink, setIsLink] = useState(editor.style().getStyle().isLink);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleLinkChange = (url: string, target: string) => {
    editor.selection().restoreSelectionRange();

    if (url) {
      editor.link().updateLink({ href: url, target });
      setIsLink(true);
    } else {
      editor.link().removeLink();
      setIsLink(false);
    }
    setShowMenu(false);
  };

  return (
    <>
      {isMenu ? (
        <button
          ref={buttonRef}
          className={`block flex p-2 border-0 rounded hover:bg-gray-100 ${
            isLink ? "tbx-active" : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault(); // Prevents losing focus before saving selection
            editor.selection().saveSelectionRange();
            setShowMenu(!showMenu);
          }}
        >
          <span className="mr-2">
            <Icon name="Link" />
          </span>
          <span>Link</span>
        </button>
      ) : (
        <Tooltip content={isLink ? "Link settings" : "Place link"}>
          <button
            ref={buttonRef}
            className={`block px-2 py-1 border-0 rounded hover:bg-gray-100 ${
              isLink ? "tbx-active" : ""
            }`}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevents losing focus before saving selection
              editor.selection().saveSelectionRange();
              setShowMenu(!showMenu);
            }}
          >
            <Icon name="Link" />
          </button>
        </Tooltip>
      )}
      <ContextualMenu
        referenceElement={buttonRef.current}
        isVisible={showMenu}
        content={<LinkMenu onChange={handleLinkChange} />}
        onClose={() => setShowMenu(false)}
      />
    </>
  );
};
