import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import ContextualMenu from "../menus/ContextualMenu";
import Icon from "../Icon";
import useEditorStore from "../../stores/EditorStore";
import { useToolbar } from "../../context/ToolbarContext";
import { useTypebloxEditor } from "../../context/EditorContext";
import VideoUploadMenu from "../menus/VideoUploadMenu";
import { extractYouTubeVideoId } from "../../utils/helpers";

interface VideoBloxProps {
  content: string | null;
  block: Blox;
  onUpdate: (update: { id: string; content: string }) => void;
}

export const Video = forwardRef<HTMLDivElement, VideoBloxProps>(
  ({ content, block, onUpdate }, ref) => {
    const { editor } = useTypebloxEditor();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [dimensions, setDimensions] = useState({
      width: parseInt(block.getAttributes().width, 10) || 560,
      height: parseInt(block.getAttributes().height, 10) || 315,
    });
    const [title, setTitle] = useState(block.getAttributes().title);

    const { setCurrentBlock } = useEditorStore();
    const { isToolbarActive, show } = useToolbar();
    const dimensionsRef = useRef(dimensions);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const videoId = content ? extractYouTubeVideoId(content) : null;

    useEffect(() => {
      if (!content) {
        setIsMenuVisible(true);
      }
    }, [content]);

    useEffect(() => {
      setDimensions({
        width: parseInt(block.getAttributes().width, 10) || 560,
        height: parseInt(block.getAttributes().height, 10) || 315,
      });
      setTitle(block.getAttributes().title);
    }, [JSON.stringify(block.getAttributes())]);

    const toggleToolbar = (event: React.MouseEvent<HTMLDivElement>) => {
      editor.selection().removeSelection();
      setCurrentBlock(block);
      const isInsideMenu = (event.target as HTMLElement).closest(
        ".tbx-contextual-menu",
      );
      if (isInsideMenu) return;

      if (content) {
        show(block.id);
        console.warn("isToolbarActive", isToolbarActive(block.id));
      } else {
        setIsMenuVisible(!isMenuVisible);
      }
    };

    const handleUrlSubmit = (url: string) => {
      const id = extractYouTubeVideoId(url);
      if (!id) return console.error("Invalid YouTube URL");

      onUpdate({
        id: block.id,
        content: `https://www.youtube.com/embed/${id}`,
      });
      setIsMenuVisible(false);
    };

    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (!ref || !("current" in ref) || !ref.current) return;

      const startX = e.clientX;
      const startY = e.clientY;

      // Get the iframe element
      const iframeElement = ref.current?.querySelector("iframe");
      if (!iframeElement) return;

      // Get initial dimensions
      const startWidth = dimensions.width || iframeElement.clientWidth;
      const startHeight = dimensions.height || iframeElement.clientHeight;

      // Calculate the original aspect ratio (16:9 for YouTube videos)
      const aspectRatio = 16 / 9;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;

        // Calculate the new width and height while maintaining the aspect ratio
        const newWidth = Math.max(280, startWidth + deltaX); // Minimum width of 280px
        const newHeight = newWidth / aspectRatio;

        const newDimensions = {
          width: newWidth,
          height: newHeight,
        };
        setDimensions(newDimensions);

        dimensionsRef.current = newDimensions; // Update the ref with the latest dimensions
      };

      const handleMouseUp = () => {
        setCurrentBlock(block);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        block.setAttribute("width", dimensionsRef.current.width.toString());
        block.setAttribute("height", dimensionsRef.current.height.toString());
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div
        ref={ref}
        className={`tbx-video-block ${block.getClasses().join(" ")}`}
        data-typeblox-id={block.id}
        data-typeblox-editor="block"
        data-focused={isToolbarActive(block.id)}
      >
        {content ? (
          <span className="tbx-video-wrapper relative inline-block">
            <div
              className="absolute inset-0 cursor-pointer z-10"
              onClick={toggleToolbar}
            />
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title || "YouTube video player"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={["", ...block.getClasses()].join(" ")}
              width={dimensions.width}
              height={dimensions.height}
              style={{
                ...block.getStyles(),
              }}
              {...block.getAttributes()}
            />
            {isToolbarActive(block.id) && (
              <div className="resize-handle" onMouseDown={handleResizeStart} />
            )}
          </span>
        ) : (
          <button className="tbx-placeholder" ref={buttonRef}>
            <Icon name="Video" />
            <span>Embed YouTube video</span>
          </button>
        )}
        <ContextualMenu
          referenceElement={buttonRef.current}
          isVisible={isMenuVisible}
          className="tbx-size-medium"
          content={<VideoUploadMenu handleUrlSubmit={handleUrlSubmit} />}
        />
      </div>
    );
  },
);
