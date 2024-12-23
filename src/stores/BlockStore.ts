import { create } from "zustand";

// Define the structure of the Zustand store

export interface DetectedStyles {
  color: string | null;
  backgroundColor: string | null;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikeout: boolean;
  fontFamily: string | null;
}

interface BlockStore {
  detectedStyles: DetectedStyles;
  setDetectedStyles: (styles: Partial<DetectedStyles>) => void; // Allows updating specific styles
}

const useBlockStore = create<BlockStore>((set: any) => ({
  detectedStyles: {
    color: null,
    backgroundColor: null,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikeout: false,
    fontFamily: null,
  },
  setDetectedStyles: (styles: Partial<DetectedStyles>) =>
    set((state: any) => ({
      detectedStyles: { ...state.detectedStyles, ...styles },
    })),
}));

export default useBlockStore;
