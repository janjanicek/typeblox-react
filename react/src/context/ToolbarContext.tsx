import React, { createContext, useContext, useState, useCallback } from "react";

interface ToolbarContextProps {
  activeBlockId: string | null;
  show: (blockId: string) => void;
  hide: (blockId?: string) => void;
  toggle: (blockId: string) => void;
  isToolbarActive: (blockId: string) => boolean;
}

const ToolbarContext = createContext<ToolbarContextProps | undefined>(
  undefined,
);

export const ToolbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const show = useCallback((blockId: string) => {
    setActiveBlockId(blockId);
  }, []);

  const hide = useCallback((blockId?: string) => {
    setActiveBlockId((prev) => {
      if (blockId != null && prev !== blockId) {
        return prev;
      }
      return null;
    });
  }, []);

  const toggle = useCallback(
    (blockId: string) => {
      if (isToolbarActive(blockId)) {
        hide(blockId);
      } else {
        show(blockId);
      }
    },
    [activeBlockId, show, hide],
  );

  const isToolbarActive = useCallback(
    (blockId: string) => {
      return activeBlockId === blockId;
    },
    [activeBlockId],
  );

  return (
    <ToolbarContext.Provider
      value={{ activeBlockId, show, hide, toggle, isToolbarActive }}
    >
      {children}
    </ToolbarContext.Provider>
  );
};

export const useToolbar = (): ToolbarContextProps => {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }
  return context;
};
