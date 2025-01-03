import { BlockType } from ".core/types";
import React, { createContext, ReactNode, useContext } from "react";
import {
  applyFormat,
  createSelectedElement,
  getStyle,
  removeSelection,
  selectAllTextInSelectedElement,
  unapplyFormat,
} from "../.core/format";

interface FormattingContextProps {
  applyFormatting: (tagName: string, style?: Record<string, string>) => void;
  unapplyFormatting: (tagName: string, styleKey?: string | null) => void;
  detectStyle: () => {
    color: string | null;
    backgroundColor: string | null;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikeout: boolean;
    fontFamily: string | null;
  };
  createSelectedElement: (range: Range) => void;
  removeSelectedWrapper: (blockElement: HTMLElement | null) => void;
}

interface FormattingProviderProps {
  blockId: string;
  onUpdate: (update: {
    id: string;
    content?: string;
    type?: BlockType;
  }) => void;
  children: ReactNode; // Add this line to define children
}

const FormattingContext = createContext<FormattingContextProps | undefined>(
  undefined,
);

export const useFormatting = (): FormattingContextProps => {
  const context = useContext(FormattingContext);
  if (!context) {
    throw new Error("useFormatting must be used within a FormattingProvider");
  }
  return context;
};

export const FormattingProvider: React.FC<FormattingProviderProps> = ({
  blockId,
  children,
  onUpdate,
}) => {
  const contentElement = document.querySelector(
    `[data-typedom-id="${blockId}"]`,
  );

  const removeSelectedWrapper = (blockElement: HTMLElement | null) => {
    removeSelection(blockElement);
  };

  const detectStyle = () => getStyle();

  const applyFormatting = (
    tagName: string,
    style: Record<string, string> = {},
  ) => {
    if (!contentElement) return;

    applyFormat(contentElement, tagName, style);

    onUpdate({ id: blockId, content: contentElement?.innerHTML || "" });

    selectAllTextInSelectedElement();
  };

  const unapplyFormatting = (
    tagName: string,
    styleKey: string | null = null,
  ) => {
    unapplyFormat(tagName, styleKey);
    onUpdate({ id: blockId, content: contentElement?.innerHTML || "" });
    selectAllTextInSelectedElement();
  };

  return (
    <FormattingContext.Provider
      value={{
        applyFormatting,
        unapplyFormatting,
        createSelectedElement,
        detectStyle,
        removeSelectedWrapper,
      }}
    >
      {children}
    </FormattingContext.Provider>
  );
};
