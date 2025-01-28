import React, { useRef, useState } from "react";
import Icon from "../../components/Icon";
import ContextualMenu from "../../components/ContextualMenu";

interface MenuProps {
  modules: Array<string>;
  getComponent: Function;
}

export const Menu: React.FC<MenuProps> = ({ modules, getComponent }) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const content = modules.map((moduleName, index) => (
    <div className="flex flex-col space-y-2">
      {getComponent({
        name: moduleName,
        isToolbar: true,
        isMenu: true,
        key: index,
      })}
    </div>
  ));

  return (
    <>
      <button
        ref={buttonRef}
        className={`px-2 py-1 border-0 rounded hover:bg-gray-100`}
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      >
        <Icon name="DotsVertical" />
      </button>
      <ContextualMenu
        referenceElement={buttonRef.current}
        isVisible={showMenu}
        content={content}
        onClose={() => setShowMenu(false)}
      />
    </>
  );
};
