import { BlockType } from "@typeblox/core/dist/types";
import { create } from "zustand";

interface EditorStore {
  toolbarSettings: Record<BlockType, string[]>;
  setToolbarSettings: (blockType: BlockType, tools: string[]) => void;
}

const useEditorStore = create<EditorStore>((set) => ({
  toolbarSettings: {
    text: [],
    image: [],
    code: [],
    headline1: [],
    headline2: [],
    headline3: [],
    html: [],
  },
  setToolbarSettings: (blockType: BlockType, tools: string[]) =>
    set((state) => ({
      toolbarSettings: {
        ...state.toolbarSettings,
        [blockType]: tools, // Update only the specified block type
      },
    })),
}));

export default useEditorStore;
