import { create } from "zustand";

interface EditorStore {
  toolbarSettings: string[]; // Array of toolbar tools (e.g., ['bold', 'italic', 'underline'])
  setToolbarSettings: (toolbar: string[]) => void; // Setter for toolbar
}

const useEditorStore = create<EditorStore>((set) => ({
  toolbarSettings: [],
  setToolbarSettings: (toolbar: string[]) =>
    set(() => ({ toolbarSettings: toolbar })), // Update toolbar
}));

export default useEditorStore;
