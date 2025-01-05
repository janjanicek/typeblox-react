import React, { useEffect, useRef, FC, useState, useCallback } from "react";
import Icon from "./Icon";

interface ContextualMenuProps {
  isVisible: boolean;
  position: { top: number; left: number };
  options: {
    label: string;
    onClick: () => void;
    style?: React.CSSProperties; // Add support for inline styles
    icon?: string;
    description?: string;
  }[];
  onClose: () => void;
  sectionName?: string;
  selectedValue?: string;
}

const ContextualMenu: FC<ContextualMenuProps> = ({
  isVisible,
  position,
  options,
  onClose,
  sectionName,
  selectedValue,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Helper function: Query and return focusable elements
  const getFocusableElements = useCallback((): HTMLElement[] => {
    const anchors = menuRef.current?.querySelectorAll("a");
    return anchors ? Array.from(anchors) : [];
  }, []);

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

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose(); // Close the menu when clicking outside
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleOutsideClick);

      // Set initial focus based on `selectedValue` or default to the first option
      const focusableElements = getFocusableElements();
      const initialIndex = selectedValue
        ? focusableElements.findIndex(
            (el) =>
              el.textContent?.trim().toLowerCase() ===
              selectedValue?.trim().toLowerCase(),
          )
        : 0;

      focusElementAtIndex(initialIndex);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [
    isVisible,
    onClose,
    selectedValue,
    getFocusableElements,
    focusElementAtIndex,
  ]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isVisible || !menuRef.current) return;

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
  }, [isVisible, onClose, getFocusableElements, focusElementAtIndex]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="typeblox-contextual-menu absolute bg-white border border-gray-300 shadow-lg p-2 z-10 rounded-md"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {sectionName && (
        <h5 className="font-bold text-slate-500 text-sm">{sectionName}</h5>
      )}
      {options.map((option, index) => (
        <a
          href="#"
          key={index}
          className={`flex cursor-pointer p-2 ${
            activeIndex === index ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          style={option.style}
          onClick={(e) => {
            e.preventDefault(); // Prevent default link behavior
            onClose();
            option.onClick();
          }}
          onMouseEnter={() => setActiveIndex(index)}
        >
          {option.icon && <Icon src={option.icon} className="mr-3" />}
          <span className="flex flex-col">
            {option.label}
            <small>{option.description}</small>
          </span>
        </a>
      ))}
    </div>
  );
};

export default ContextualMenu;
