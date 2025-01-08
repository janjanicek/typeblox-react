export type BlockType =
  | "text"
  | "code"
  | "image"
  | "headline1"
  | "headline2"
  | "headline3"
  | "html";

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
