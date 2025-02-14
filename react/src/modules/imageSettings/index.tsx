import { Blox } from "@typeblox/core/dist/classes/Blox";
import React, { useRef, useState } from "react";
import Icon from "../../components/Icon";
import ImageSettingsMenu from "../../components/modals/ImageSettings"; // Fixed incorrect import
import Tooltip from "../../components/Tooltip";
import Modal from "../../components/Modal";

interface ImageSettingsProps {
  setShowToolbar: (visible: boolean) => void;
  block: Blox;
}

export const ImageSettings: React.FC<ImageSettingsProps> = ({ block }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative">
      <Tooltip content="Image settings">
        <button
          ref={buttonRef}
          className="px-2 py-1 border-0 rounded hover:bg-gray-100"
          onClick={() => setIsModalOpen((prev) => !prev)}
        >
          <Icon name="Settings" />
        </button>
      </Tooltip>

      <Modal
        title="Image Settings"
        children={<ImageSettingsMenu block={block} onClose={closeModal} />}
        onClose={closeModal}
        isOpen={isModalOpen}
        className="size-s"
      />
    </div>
  );
};

export default ImageSettings;
