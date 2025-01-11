import React from "react";
import {
  X,
  AlignLeft,
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
      case "alignLeft":
        return <AlignLeft color={color} />;
      case "article":
        return <Article color={color} />;
      case "bold":
        return <Bold color={color} />;
      case "clear":
        return <ClearFormatting color={color} />;
      case "code":
        return <Code color={color} />;
      case "code":
        return <Code color={color} />;
      case "h1":
        return <H1 color={color} />;
      case "h2":
        return <H2 color={color} />;
      case "h3":
        return <H3 color={color} />;
      case "highlight":
        return <Highlight color={color} />;
      case "italic":
        return <Italic color={color} />;
      case "letterA":
        return <LetterA color={color} />;
      case "photo":
        return <Photo color={color} />;
      case "plus":
        return <Plus color={color} />;
      case "strike":
        return <Strikethrough color={color} />;
      case "textSize":
        return <TextSize color={color} />;
      case "trash":
        return <Trash color={color} />;
      case "underline":
        return <Underline color={color} />;
      default:
        return <X />;
    }
  };

  return <>{getIconByName()}</>;
};

export default Icon;
