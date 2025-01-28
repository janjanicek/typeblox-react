import { Blox } from "@typeblox/core/dist/classes/Blox";
import React, { useRef, useState } from "react";
import ContextualMenu from "../../components/ContextualMenu";
import Icon from "../../components/Icon";
import Tooltip from "../../components/Tooltip";
import UploadMenu from "../../components/UploadMenu";

interface ReplaceImageProps {
  setShowToolbar: Function;
  onUpdate: Function;
  block: Blox;
}

export const ReplaceImage: React.FC<ReplaceImageProps> = ({
  onUpdate,
  block,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onUpdate({
        id: block.id,
        content: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  return (
    <div className="relative">
      <Tooltip content="Replace image">
        <button
          ref={buttonRef}
          className={`px-2 py-1 border-0 rounded hover:bg-gray-100`}
          data-tooltip-target="replace-image-tooltip"
          onClick={() => {
            setIsMenuVisible(!isMenuVisible);
          }}
        >
          <Icon name="Refresh" />
        </button>
      </Tooltip>
      <ContextualMenu
        referenceElement={buttonRef.current}
        isVisible={isMenuVisible}
        className="tbx-size-medium"
        content={
          <UploadMenu
            onChange={(e) => {
              handleFileChange(e);
              setIsMenuVisible(false);
            }}
            onUrlSubmit={(url) => {
              onUpdate({
                id: block.id,
                content: url,
              });
              setIsMenuVisible(false);
            }}
          />
        }
      />
    </div>
  );
};
