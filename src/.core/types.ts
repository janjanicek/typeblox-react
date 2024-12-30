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
