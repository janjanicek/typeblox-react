import React, { useState } from "react";
import Icon from "../../components/Icon";
import { useTypebloxEditor } from "../../context/EditorContext";
import Modal from "../../components/Modal";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import Tooltip from "../../components/Tooltip";

interface ViewAsCodeProps {
  block: Blox;
}

export const ViewAsCode: React.FC<ViewAsCodeProps> = ({ block }) => {
  const { editor } = useTypebloxEditor();
  const currentBlock = block;

  // State to manage the textarea value
  const [content, setContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle content submission
  const handleSubmit = () => {
    if (currentBlock.id) {
      editor.getBlockById(currentBlock.id)?.setContent(content);
    }
    closeModal();
  };

  const openModal = () => {
    editor.unselect(block.getContentElement(), () => {
      const currentBlock = editor.getBlockById(block.id);
      const currentContent = currentBlock?.getContent();
      if (currentContent) setContent(currentContent);
      setIsModalOpen(true);
    });
  };

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Tooltip content="Source code">
        <button
          onClick={openModal}
          className="px-2 py-1 border-0 rounded hover:bg-gray-100"
        >
          <Icon name="Code" />
        </button>
      </Tooltip>
      <Modal
        title="View Block as Code"
        showCloseButton={false}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <div className="space-y-4 flex flex-col">
          {/* Textarea to edit the block content */}
          <textarea
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
            className="w-full h-64 border p-2 d-block"
          />
          <div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white tbx-bg-primary rounded"
            >
              Save change
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
