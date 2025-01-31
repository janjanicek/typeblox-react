import {
  useFloating,
  inline,
  offset,
  flip,
  shift,
  autoPlacement,
} from "@floating-ui/react";
import React, { useEffect, useRef, FC, useState, useCallback } from "react";
import Icon from "./Icon";

interface ContextualMenuProps {
  referenceElement?: HTMLElement | null;
  isVisible: boolean;
  onClose?: () => void;
  position?: { top: number; left: number };
  content?: React.ReactNode;
  options?: {
    component?: React.ReactNode;
    label?: string;
    onClick?: () => void;
    style?: React.CSSProperties; // Add support for inline styles
    icon?: string;
    description?: string;
  }[];
  onOpen?: () => void;
  sectionName?: string;
  selectedValue?: string;
  className?: string;
}

const ContextualMenu: FC<ContextualMenuProps> = ({
  isVisible,
  referenceElement,
  options,
  content,
  onClose = () => {},
  onOpen,
  sectionName,
  selectedValue,
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Initialize useFloating with proper type annotations
  const { refs, floatingStyles } = useFloating<HTMLDivElement>({
    placement: "bottom-start",
    middleware: [
      offset(8), // Adds space between the tooltip and the trigger element
      flip(), // Ensures the tooltip flips if it overflows the viewport
      shift({ padding: 8 }), // Prevents the tooltip from overflowing
    ],
  });

  // Effect to set the reference element if provided
  useEffect(() => {
    if (referenceElement) {
      refs.setReference(referenceElement);
    }
  }, [referenceElement, refs]);

  // Helper function: Query and return focusable elements
  const getFocusableElements = useCallback((): HTMLElement[] => {
    const anchors = Array.from(
      refs.floating?.current?.querySelectorAll("a") || [],
    ) as HTMLElement[];
    const buttons = Array.from(
      refs.floating?.current?.querySelectorAll("button") || [],
    ) as HTMLElement[];
    return [...anchors, ...buttons];
  }, [refs.floating]);

  // Helper function: Focus an element at a given index
  const focusElementAtIndex = useCallback(
    (index: number) => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        const clampedIndex = Math.max(
          0,
          Math.min(index, focusableElements.length - 1),
        );
        focusableElements[clampedIndex]?.focus();
        setActiveIndex(clampedIndex);
      }
    },
    [getFocusableElements],
  );

  useEffect(() => {
    if (isVisible) {
      const focusableElements = getFocusableElements();
      const initialIndex = selectedValue
        ? focusableElements.findIndex(
            (el) =>
              el.textContent?.trim().toLowerCase() ===
              selectedValue?.trim().toLowerCase(),
          )
        : 0;
      focusElementAtIndex(initialIndex);
      setActiveIndex(initialIndex);
    }
  }, [focusElementAtIndex, isVisible]);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (
        refs.floating?.current &&
        !refs.floating.current.contains(e.target as Node) &&
        referenceElement &&
        !referenceElement.contains(e.target as Node)
      ) {
        onClose(); // Close the menu when clicking outside
      }
    },
    [refs.floating, referenceElement, onClose],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isVisible || !refs.floating?.current) return;

    if (isVisible && onOpen) onOpen();

    const handleKeyDown = (e: KeyboardEvent) => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const currentIndex = focusableElements.findIndex(
        (el) => el === document.activeElement,
      );

      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusElementAtIndex((currentIndex + 1) % focusableElements.length); // Wrap around
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        focusElementAtIndex(
          (currentIndex - 1 + focusableElements.length) %
            focusableElements.length,
        ); // Wrap around
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose(); // Close the menu
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isVisible,
    onClose,
    onOpen,
    getFocusableElements,
    focusElementAtIndex,
    refs.floating,
  ]);

  if (!isVisible) return null;

  return (
    <div
      ref={refs.setFloating}
      className={`tbx-contextual-menu bg-white border border-gray-300 shadow-lg p-2 z-10 rounded-md ${className}`}
      style={floatingStyles}
    >
      {sectionName && (
        <h5 className="font-bold text-slate-500 text-sm">{sectionName}</h5>
      )}
      {content && <>{content}</>}
      {options &&
        options.map((option, index) =>
          option.component ? (
            <div key={index}>{option.component}</div>
          ) : (
            <a
              href="#"
              key={index}
              className={`flex cursor-pointer p-2 ${
                activeIndex === index ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              // className={`flex cursor-pointer p-2`}
              style={option.style}
              onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                onClose();
                if (option.onClick) option.onClick();
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option.icon && (
                <span className="mr-3">
                  <Icon name={option.icon} />
                </span>
              )}
              <span className="flex flex-col">
                {option.label}
                {option.description && (
                  <small className="text-gray-500">{option.description}</small>
                )}
              </span>
            </a>
          ),
        )}
    </div>
  );
};

export default ContextualMenu;
