import React from "react";
import {
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Article,
  Bold,
  ClearFormatting,
  Code,
  H1,
  H2,
  H3,
  Highlight,
  Italic,
  LetterA,
  Photo,
  Plus,
  Strikethrough,
  TextSize,
  Trash,
  Underline,
  Refresh,
  ArrowUp,
  ArrowDown,
  GripVertical,
  DotsVertical,
  List,
  ListNumbers,
  Link,
  Copy,
  Blockquote,
  Settings,
  Video,
  Columns,
} from "tabler-icons-react";
import { useTypebloxEditor } from "../context/EditorContext";

interface IconProps {
  name: string;
  width?: number; // The width of the icon (optional, default: 24)
  height?: number; // The height of the icon (optional, default: 24)
  alt?: string; // Alternative text for the icon (optional, default: "icon")
  className?: string; // Additional CSS class names (optional)
  [key: string]: any; // Allows for additional props
}

const Icon: React.FC<IconProps> = ({
  name,
  width = 24,
  height = 24,
  alt = "icon",
  color = "black",
  ...props
}) => {
  const { editorSettings } = useTypebloxEditor();
  const themeColor = editorSettings?.theme === "light" ? "black" : "white";

  const getIconByName = () => {
    switch (name) {
      case "x":
        return <X color={themeColor} />;
      case "AlignLeft":
        return <AlignLeft color={themeColor} />;
      case "AlignCenter":
        return <AlignCenter color={themeColor} />;
      case "AlignRight":
        return <AlignRight color={themeColor} />;
      case "Article":
        return <Article color={themeColor} />;
      case "Bold":
        return <Bold color={themeColor} />;
      case "ClearFormatting":
        return <ClearFormatting color={themeColor} />;
      case "Code":
        return <Code color={themeColor} />;
      case "Code":
        return <Code color={themeColor} />;
      case "H1":
        return <H1 color={themeColor} />;
      case "H2":
        return <H2 color={themeColor} />;
      case "H3":
        return <H3 color={themeColor} />;
      case "Highlight":
        return <Highlight color={themeColor} />;
      case "Italic":
        return <Italic color={themeColor} />;
      case "LetterA":
        return <LetterA color={themeColor} />;
      case "Photo":
        return <Photo color={themeColor} />;
      case "Plus":
        return <Plus color={themeColor} />;
      case "Strike":
        return <Strikethrough color={themeColor} />;
      case "TextSize":
        return <TextSize color={themeColor} />;
      case "Trash":
        return <Trash color={themeColor} />;
      case "Underline":
        return <Underline color={themeColor} />;
      case "Refresh":
        return <Refresh color={themeColor} />;
      case "ArrowUp":
        return <ArrowUp color={themeColor} />;
      case "ArrowDown":
        return <ArrowDown color={themeColor} />;
      case "GripVertical":
        return <GripVertical color={themeColor} />;
      case "DotsVertical":
        return <DotsVertical color={themeColor} />;
      case "List":
        return <List color={themeColor} />;
      case "ListNumbers":
        return <ListNumbers color={themeColor} />;
      case "Copy":
        return <Copy color={themeColor} />;
      case "Link":
        return <Link color={themeColor} />;
      case "Blockquote":
        return <Blockquote color={themeColor} />;
      case "Settings":
        return <Settings color={themeColor} />;
      case "Video":
        return <Video color={themeColor} />;
      case "Columns2":
        return <Columns color={themeColor} />;
      default:
        return <X color={themeColor} />;
    }
  };

  return <>{getIconByName()}</>;
};

export default Icon;
