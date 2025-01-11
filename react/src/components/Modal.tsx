import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

interface ModalProps {
  title: string;
  children: ReactNode; // Content passed as children
  showCloseButton: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  showCloseButton,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <div
            className="relative w-10/12 p-6 bg-white rounded shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent click on the backdrop from closing the modal
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              <button
                className="px-2 py-2 text-gray-600 rounded hover:bg-gray-200"
                onClick={onClose}
              >
                <Icon name="x" />
              </button>
            </div>
            <div className="mt-2 text-gray-600">{children}</div>
            {showCloseButton && (
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    document.body,
  );
};

export default Modal;
