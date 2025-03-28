import { Blox } from "@typeblox/core/dist/classes/Blox";
import React, { useRef, useState } from "react";
import Icon from "../../components/Icon";
import Tooltip from "../../components/Tooltip";
import Modal from "../../components/Modal";
import VideoSettingsMenu from "../../components/modals/VideoSettings";

interface VideoSettingProps {
  block: Blox;
}

export const VideoSettings: React.FC<VideoSettingProps> = ({ block }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative">
      <Tooltip content="Video settings">
        <button
          ref={buttonRef}
          className="px-2 py-1 border-0 rounded hover:bg-gray-100"
          onClick={() => setIsModalOpen((prev) => !prev)}
        >
          <Icon name="Settings" />
        </button>
      </Tooltip>

      <Modal
        title="Video Settings"
        children={<VideoSettingsMenu block={block} onClose={closeModal} />}
        onClose={closeModal}
        isOpen={isModalOpen}
        className="size-s"
      />
    </div>
  );
};

export default VideoSettings;
