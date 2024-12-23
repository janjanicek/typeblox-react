import React, { useEffect, useRef, FC } from "react";

interface ContextualMenuProps {
  isVisible: boolean;
  position: { top: number; left: number };
  options: {
    label: string;
    onClick: () => void;
    style?: React.CSSProperties; // Add support for inline styles
  }[];
  onClose: () => void;
}

const ContextualMenu: FC<ContextualMenuProps> = ({
  isVisible,
  position,
  options,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bg-white border border-gray-300 shadow-lg p-2 z-10"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {options.map((option, index) => (
        <p
          key={index}
          className="cursor-pointer hover:bg-gray-100 p-1"
          style={option.style}
          onClick={() => {
            onClose();
            option.onClick();
          }}
        >
          {option.label}
        </p>
      ))}
    </div>
  );
};

export default ContextualMenu;
