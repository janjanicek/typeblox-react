import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

interface ModalProps {
  title: string;
  children: ReactNode; // Content passed as children
  showCloseButton?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  showCloseButton = false,
  isOpen = false,
  onClose,
  className,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Modal */}
      {isOpen && (
        <div
          className={`tbx-modal fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50`}
        >
          <div
            className={`tbx-body relative w-10/12 p-6 bg-white rounded shadow-lg ${className}`}
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button className="px-2 py-2 rounded" onClick={onClose}>
                <Icon name="X" />
              </button>
            </div>
            <div className="mt-2">{children}</div>
            {showCloseButton && (
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 rounded" onClick={onClose}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    document.getElementById("typeblox-editor") as Element,
  );
};

export default Modal;
