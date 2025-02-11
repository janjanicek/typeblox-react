import { create } from "zustand";

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
  setDetectedStyles: (styles: Partial<DetectedStyles>) => void;
  isBold: boolean;
  setIsBold: (isBold: boolean) => void;
  isItalic: boolean;
  setIsItalic: (isItalic: boolean) => void;
  isUnderline: boolean;
  setIsUnderline: (isUnderline: boolean) => void;
  isStrikeout: boolean;
  setIsStrikeout: (isStrikeout: boolean) => void;
  showSelectFont: boolean;
  setShowSelectFont: (showSelectFont: boolean) => void;
  selectedFont: string;
  setSelectedFont: (selectedFont: string) => void;
  selectedColor: string;
  setSelectedColor: (selectedColor: string) => void;
  selectedBgColor: string;
  setSelectedBgColor: (selectedBgColor: string) => void;
  selectedCodeLanguage: string;
  setSelectedCodeLanguage: (selectedCodeLanguage: string) => void;
  showTypeSelection: boolean;
  setShowTypeSelection: (showTypeSelection: boolean) => void;
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
  isBold: false,
  setIsBold: (isBold: boolean) =>
    set(() => ({
      isBold,
    })),
  isItalic: false,
  setIsItalic: (isItalic: boolean) =>
    set(() => ({
      isItalic,
    })),
  isUnderline: false,
  setIsUnderline: (isUnderline: boolean) =>
    set(() => ({
      isUnderline,
    })),
  isStrikeout: false,
  setIsStrikeout: (isStrikeout: boolean) =>
    set(() => ({
      isStrikeout,
    })),
  showSelectFont: false,
  setShowSelectFont: (showSelectFont: boolean) =>
    set(() => ({
      showSelectFont,
    })),
  showTypeSelection: false,
  setShowTypeSelection: (showTypeSelection: boolean) =>
    set(() => ({
      showTypeSelection,
    })),
  selectedFont: "arial",
  setSelectedFont: (selectedFont: string) =>
    set(() => ({
      selectedFont,
    })),
  selectedColor: "#000000",
  setSelectedColor: (selectedColor: string) =>
    set(() => ({
      selectedColor,
    })),
  selectedBgColor: "#ffffff",
  setSelectedBgColor: (selectedBgColor: string) =>
    set(() => ({
      selectedBgColor,
    })),
  selectedCodeLanguage: "javascript",
  setSelectedCodeLanguage: (selectedCodeLanguage: string) =>
    set(() => ({
      selectedCodeLanguage,
    })),
}));

export default useBlockStore;
