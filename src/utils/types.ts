export interface Block {
  id: string;
  type: "text" | "code" | "image";
  content: string | null; // Content can be null for images
}
