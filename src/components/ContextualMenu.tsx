import React, { useEffect, useRef, FC, useState } from "react";
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
}

const ContextualMenu: FC<ContextualMenuProps> = ({
  isVisible,
  position,
  options,
  onClose,
  sectionName,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose(); // Close the menu when clicking outside
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    if (!isVisible || !menuRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const anchors = menuRef.current?.querySelectorAll("a");
      if (!anchors || anchors.length === 0) return;

      const focusableElements = Array.from(anchors) as HTMLElement[];
      const currentIndex = focusableElements.findIndex(
        (el) => el === document.activeElement,
      );

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length; // Wrap around
        focusableElements[nextIndex].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + focusableElements.length) %
          focusableElements.length; // Wrap around
        focusableElements[prevIndex].focus();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose(); // Close the menu
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="typedom-contextual-menu absolute bg-white border border-gray-300 shadow-lg p-2 z-10 rounded-md"
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
          onClick={() => {
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
