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
  Copy,
} from "tabler-icons-react";

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
  const getIconByName = () => {
    switch (name) {
      case "x":
        return <X color={color} />;
      case "AlignLeft":
        return <AlignLeft color={color} />;
      case "AlignCenter":
        return <AlignCenter color={color} />;
      case "AlignRight":
        return <AlignRight color={color} />;
      case "Article":
        return <Article color={color} />;
      case "Bold":
        return <Bold color={color} />;
      case "Clear":
        return <ClearFormatting color={color} />;
      case "Code":
        return <Code color={color} />;
      case "Code":
        return <Code color={color} />;
      case "H1":
        return <H1 color={color} />;
      case "H2":
        return <H2 color={color} />;
      case "H3":
        return <H3 color={color} />;
      case "Highlight":
        return <Highlight color={color} />;
      case "Italic":
        return <Italic color={color} />;
      case "LetterA":
        return <LetterA color={color} />;
      case "Photo":
        return <Photo color={color} />;
      case "Plus":
        return <Plus color={color} />;
      case "Strike":
        return <Strikethrough color={color} />;
      case "TextSize":
        return <TextSize color={color} />;
      case "Trash":
        return <Trash color={color} />;
      case "Underline":
        return <Underline color={color} />;
      case "Refresh":
        return <Refresh color={color} />;
      case "ArrowUp":
        return <ArrowUp color={color} />;
      case "ArrowDown":
        return <ArrowDown color={color} />;
      case "GripVertical":
        return <GripVertical color={color} />;
      case "DotsVertical":
        return <DotsVertical color={color} />;
      case "List":
        return <List color={color} />;
      case "ListNumbers":
        return <ListNumbers color={color} />;
      case "Copy":
        return <Copy color={color} />;
      default:
        return <X />;
    }
  };

  return <>{getIconByName()}</>;
};

export default Icon;
