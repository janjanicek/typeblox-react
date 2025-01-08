import React, { useState } from "react";
import Icon from "../../components/Icon";
import { useEditor } from "../../utils/EditorContext";
import Modal from "../../components/Modal";
import { Blox } from "@typeblox/core/classes/Blox";

interface ViewAsCodeProps {
  block: Blox;
}

export const ViewAsCode: React.FC<ViewAsCodeProps> = ({ block }) => {
  const { editor } = useEditor();
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
      console.log(currentContent);
      console.log(block.getContent());
      console.log(currentBlock?.getContentElement());
      setIsModalOpen(true);
    });
  };

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="px-2 py-1 border-0 rounded hover:bg-gray-100"
      >
        <Icon src="icons/code.svg" alt="View as Code" />
      </button>
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
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Save change
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
