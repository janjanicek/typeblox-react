import { Blox } from "@typeblox/core/dist/classes/Blox";
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
import { ClearFormatting } from "../modules/clearFormatting";
import { Drag } from "../modules/drag";
import { Extension } from "../modules/extension";
import ImageSettings from "../modules/imageSettings";
import { Link } from "../modules/link";
import { Menu } from "../modules/menu";
import { ReplaceImage } from "../modules/replaceImage";
import { ReplaceVideo } from "../modules/replaceVideo";
import VideoSettings from "../modules/videoSettings";

interface ComponentProps {
  name: string;
  isToolbar?: boolean;
  isMenu?: boolean;
  key?: number;
}

interface BlockContextProps {
  getComponent: (props: ComponentProps) => JSX.Element | undefined;
  getShortcut: (name: string) => string | undefined;
  block: Blox;
}

interface BlockProviderProps {
  children: ReactNode;
  block?: any;
  onUpdate?: (update: any) => void;
  dragListeners?: any;
}

const BlockContext = createContext<BlockContextProps | null>(null);

export const BlockProvider: FC<BlockProviderProps> = ({
  children,
  block,
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
        return <ReplaceImage block={block} onUpdate={onUpdate} />;
      case "replaceVideo":
        return <ReplaceVideo block={block} onUpdate={onUpdate} />;
      case "imageSettings":
        return <ImageSettings block={block} />;
      case "videoSettings":
        return <VideoSettings block={block} />;
      case "align":
        return <Align block={block} isMenu={isMenuComponent} />;

      case "link":
        return <Link isMenu={isMenuComponent} />;

      case "clearFormatting":
        return <ClearFormatting isMenu={isMenuComponent} />;
      case "type":
        return <TypeChange block={block} onUpdate={onUpdate} />;
      case "add":
        return <Add blockId={block?.id} isToolbar={isToolbar} />;
      case "drag":
        return (
          <Drag
            blockId={block?.id}
            dragListeners={dragListeners}
            isToolbar={isToolbar}
            setIsBlockSelected={() => {}}
          />
        );
      case "menu":
        return <Menu modules={menuModules} getComponent={getComponent} />;
      default:
        return <Extension name={name} />;
    }
  };

  const isMacOS = (): boolean => {
    // Feature detect `userAgentData` (optional chaining for safety)
    if (
      typeof navigator !== "undefined" &&
      (navigator as any).userAgentData?.platform
    ) {
      return (navigator as any).userAgentData.platform
        .toLowerCase()
        .includes("mac");
    }

    // Fallback to `userAgent` for older browsers
    return (
      typeof navigator !== "undefined" &&
      /Mac|iPhone|iPod|iPad/.test(navigator.userAgent)
    );
  };

  const getShortcut = (action: string): string | undefined => {
    const modifierKey = isMacOS() ? "⌘" : "CTRL+";

    switch (action) {
      case "bold":
        return `${modifierKey}B`;
      case "italic":
        return `${modifierKey}I`;
      case "underline":
        return `${modifierKey}U`;
      default:
        return undefined; // Return undefined if no matching shortcut exists
    }
  };

  return (
    <BlockContext.Provider value={{ getComponent, getShortcut, block }}>
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
