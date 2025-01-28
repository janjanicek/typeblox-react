import React, { createContext, useContext, ReactNode, FC } from "react";
import {
  Divider,
  Font,
  Color,
  BgColor,
  ViewAsCode,
  TypeChange,
  Bold,
  Italic,
  Underline,
  Strikethrough,
} from "../modules";
import { Add } from "../modules/add";
import { Align } from "../modules/align";
import { Drag } from "../modules/drag";
import { Extension } from "../modules/extension";
import { Menu } from "../modules/menu";
import { ReplaceImage } from "../modules/replaceImage";

interface ComponentProps {
  name: string;
  isToolbar?: boolean;
  isMenu?: boolean;
  key?: number;
}

interface BlockContextProps {
  getComponent: (props: ComponentProps) => JSX.Element | undefined;
}

interface BlockProviderProps {
  children: ReactNode;
  block?: any;
  setShowToolbar?: (show: boolean) => void;
  onUpdate?: (update: any) => void;
  dragListeners?: any;
}

const BlockContext = createContext<BlockContextProps | null>(null);

export const BlockProvider: FC<BlockProviderProps> = ({
  children,
  block,
  setShowToolbar = () => {},
  onUpdate = () => {},
  dragListeners,
}) => {
  const getComponent = ({
    name,
    isToolbar = false,
    isMenu = false,
    key,
  }: ComponentProps): JSX.Element | undefined => {
    let updatedName = name;
    let isCollapsed = false;
    let isMenuComponent = isMenu;
    let menuModules: string[] = [];

    if (/\[.*\]/.test(updatedName)) {
      isCollapsed = true;
      updatedName = updatedName.replace(/\[|\]/g, "");
      menuModules = updatedName.split(",");
      isMenuComponent = true;
      if (menuModules.length > 1) {
        updatedName = "menu";
      }
    }
    switch (updatedName) {
      case "bold":
        return <Bold isMenu={isMenuComponent} key={key} />;
      case "italic":
        return <Italic isMenu={isMenuComponent} key={key} />;
      case "underline":
        return <Underline isMenu={isMenuComponent} key={key} />;
      case "strikethrough":
        return <Strikethrough isMenu={isMenuComponent} key={key} />;
      case "divider":
        return <Divider />;
      case "font":
        return <Font />;
      case "color":
        return <Color />;
      case "bgColor":
        return <BgColor />;
      case "viewCode":
        return <ViewAsCode block={block} />;
      case "replaceImage":
        return (
          <ReplaceImage
            setShowToolbar={setShowToolbar}
            block={block}
            onUpdate={onUpdate}
          />
        );
      case "align":
        return <Align block={block} isMenu={isMenuComponent} />;
      case "type":
        return <TypeChange block={block} onUpdate={onUpdate} />;
      case "add":
        return (
          <Add
            blockId={block?.id}
            isToolbar={isToolbar}
            setShowToolbar={setShowToolbar}
          />
        );
      case "drag":
        return (
          <Drag
            blockId={block?.id}
            dragListeners={dragListeners}
            isToolbar={isToolbar}
            setShowToolbar={setShowToolbar}
            setIsBlockSelected={() => {}}
          />
        );
      case "menu":
        return <Menu modules={menuModules} getComponent={getComponent} />;
      default:
        return <Extension name={name} />;
    }
  };

  return (
    <BlockContext.Provider value={{ getComponent }}>
      {children}
    </BlockContext.Provider>
  );
};

export const useBlock = () => {
  const context = useContext(BlockContext);
  if (!context) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }
  return context;
};
