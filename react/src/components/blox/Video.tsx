import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import ContextualMenu from "../menus/ContextualMenu";
import Icon from "../Icon";
import useEditorStore from "../../stores/EditorStore";
import { useToolbar } from "../../context/ToolbarContext";
import { useTypebloxEditor } from "../../context/EditorContext";
import VideoUploadMenu from "../menus/VideoUploadMenu";
import { extractVideoEmbedInfo } from "../../utils/helpers";

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

    // Extract embed info from content
    const embedInfo = content ? extractVideoEmbedInfo(content) : null;

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
      } else {
        setIsMenuVisible(!isMenuVisible);
      }
    };

    const handleUrlSubmit = (url: string) => {
      const info = extractVideoEmbedInfo(url);
      if (!info.embedUrl) return console.error("Invalid video URL");

      onUpdate({
        id: block.id,
        content: info.embedUrl, // Store the original URL for future-proofing
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

      // Use aspect ratio from embedInfo if available
      const aspectRatio = embedInfo?.aspectRatio || 16 / 9;

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
        onClick={toggleToolbar}
      >
        {embedInfo ? (
          <span className="tbx-video-wrapper relative inline-block">
            <div className="absolute inset-0 cursor-pointer z-2" />
            <iframe
              src={embedInfo.embedUrl}
              title={title || embedInfo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={["", ...block.getClasses()].join(" ")}
              {...block.getAttributes()}
              width={dimensions.width}
              height={dimensions.height}
              style={{
                ...block.getStyles(),
              }}
            />
            {isToolbarActive(block.id) && (
              <div className="resize-handle" onMouseDown={handleResizeStart} />
            )}
          </span>
        ) : (
          <button className="tbx-placeholder" ref={buttonRef}>
            <Icon name="Video" />
            <span>Embed video</span>
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
  }
);
