export type BlockType =
  | "text"
  | "code"
  | "image"
  | "headline1"
  | "headline2"
  | "headline3";

export interface Block {
  id: string;
  type: BlockType;
  content: string | null; // Content can be null for images
}

export interface detectedStyles {
  color: string | null;
  backgroundColor: string | null;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikeout: boolean;
  fontFamily: string | null;
  isH1: boolean;
  isH2: boolean;
  isH3: boolean;
  isParagraph: boolean;
  isCode: boolean;
}

export type CustomRange = {
  start: number;
  end: number;
};
