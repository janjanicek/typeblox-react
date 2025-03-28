import { Blox } from "@typeblox/core/dist/classes/Blox";
import React, { useRef, useState } from "react";
import ContextualMenu from "../../components/menus/ContextualMenu";
import Icon from "../../components/Icon";
import Tooltip from "../../components/Tooltip";
import VideoUploadMenu from "../../components/menus/VideoUploadMenu";
import { extractYouTubeVideoId } from "../../utils/helpers";

interface ReplaceVideoProps {
  onUpdate: Function;
  block: Blox;
}

export const ReplaceVideo: React.FC<ReplaceVideoProps> = ({
  onUpdate,
  block,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleUrlSubmit = (url: string) => {
    const id = extractYouTubeVideoId(url);
    if (!id) return console.error("Invalid YouTube URL");

    onUpdate({ id: block.id, content: `https://www.youtube.com/embed/${id}` });
    setIsMenuVisible(false);
  };

  return (
    <div className="relative">
      <Tooltip content="Replace video">
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
        content={<VideoUploadMenu handleUrlSubmit={handleUrlSubmit} />}
      />
    </div>
  );
};
