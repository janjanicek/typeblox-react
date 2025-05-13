import { Blox } from "@typeblox/core/dist/classes/Blox";
import { BlockType, detectedStyles } from "@typeblox/core/dist/types";
import { DEFAULT_STYLES } from "@typeblox/core/dist/constants";
import { create } from "zustand";

interface EditorStore {
  toolbarSettings: Record<BlockType, string[]>;
  menuSettings: Record<string, string[]>;
  setToolbarSettings: (blockType: BlockType, tools: string[]) => void;
  setMenuSettings: (menuName: string, modules: string[]) => void;
  currentBlock: Blox | null;
  setCurrentBlock: (currentBlock: Blox) => void;
  currentStyle: detectedStyles | null;
  setCurrentStyle: (currentStyle: detectedStyles) => void;
  editorRef: React.RefObject<HTMLDivElement> | null;
  setEditorRef: (ref: React.RefObject<HTMLDivElement> | null) => void;
  overId: string | null;
  setOverId: (id: string | null) => void;
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
  currentBlock: null,
  setCurrentBlock: (currentBlock: Blox) =>
    set(() => ({
      currentBlock,
    })),
  currentStyle: { ...DEFAULT_STYLES },
  setCurrentStyle: (currentStyle: detectedStyles) => {
    set(() => ({
      currentStyle,
    }));
  },
  editorRef: null,
  setEditorRef: (ref: React.RefObject<HTMLDivElement> | null) => {
    set(() => ({
      editorRef: ref,
    }));
  },
  overId: null,
  setOverId: (id) =>
    set(() => ({
      overId: id,
    })),
}));

export default useEditorStore;
