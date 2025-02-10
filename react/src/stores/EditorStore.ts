import { BlockType } from "@typeblox/core/dist/types";
import { create } from "zustand";

interface EditorStore {
  toolbarSettings: Record<BlockType, string[]>;
  menuSettings: Record<string, string[]>;
  setToolbarSettings: (blockType: BlockType, tools: string[]) => void;
  setMenuSettings: (menuName: string, modules: string[]) => void;
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
    numberedList: [],
    bulletedList: [],
    blockquote: [],
  },
  setToolbarSettings: (blockType: BlockType, tools: string[]) =>
    set((state) => ({
      toolbarSettings: {
        ...state.toolbarSettings,
        [blockType]: tools, // Update only the specified block type
      },
    })),
  menuSettings: {
    block: [],
  },
  setMenuSettings: (menuName: string, modules: string[]) =>
    set((state) => ({
      menuSettings: {
        ...state.menuSettings,
        [menuName]: modules, // Update only the specified block type
      },
    })),
}));

export default useEditorStore;
