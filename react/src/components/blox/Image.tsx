import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import ContextualMenu from "../menus/ContextualMenu";
import Icon from "../Icon";
import ImageUploadMenu from "../menus/ImageUploadMenu";
import useEditorStore from "../../stores/EditorStore";
import { useToolbar } from "../../context/ToolbarContext";
import { useTypebloxEditor } from "../../context/EditorContext";

interface ImageBloxProps {
  content: string | null;
  block: Blox;
  onUpdate: (update: { id: string; content: string }) => void;
}

export const Image = forwardRef<HTMLDivElement, ImageBloxProps>(
  ({ content, block, onUpdate }, ref) => {
    const { editor } = useTypebloxEditor();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [dimensions, setDimensions] = useState({
      width: block.getStyles().width || "auto",
      height: block.getStyles().height || "auto",
    });

    const { setCurrentBlock } = useEditorStore();
    const { isToolbarActive, show } = useToolbar();
    const dimensionsRef = useRef(dimensions);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      if (!content) {
        setIsMenuVisible(true);
      }
    }, [content]);

    useEffect(() => {
      setDimensions({
        width: block.getStyles().width || "auto",
        height: block.getStyles().height || "auto",
      });
    }, [JSON.stringify(block.getStyles())]);

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        onUpdate({
          id: block.id,
          content: URL.createObjectURL(event.target.files[0]),
        });
      }
    };

    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (!ref || !("current" in ref) || !ref.current) return;

      const startX = e.clientX;
      const startY = e.clientY;

      // Get the <img> element and its natural dimensions
      const imgElement = ref.current?.querySelector("img");
      if (!imgElement) return;

      const naturalWidth = imgElement.naturalWidth;
      const naturalHeight = imgElement.naturalHeight;

      // Calculate the original aspect ratio
      const aspectRatio = naturalWidth / naturalHeight;

      // Get initial dimensions
      const startWidth =
        parseInt(dimensions.width, 10) || imgElement.clientWidth;
      const startHeight =
        parseInt(dimensions.height, 10) || imgElement.clientHeight;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;

        // Calculate the new width and height while maintaining the original aspect ratio
        const newWidth = Math.max(50, startWidth + deltaX);
        const newHeight = newWidth / aspectRatio;

        const newDimensions = {
          width: `${newWidth}px`,
          height: `${newHeight}px`,
        };
        setDimensions(newDimensions);

        dimensionsRef.current = newDimensions; // Update the ref with the latest dimensions
      };

      const handleMouseUp = () => {
        setCurrentBlock(block);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        block.setStyle("width", dimensionsRef.current.width);
        block.setStyle("height", dimensionsRef.current.height);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div
        ref={ref}
        className={`tbx-image-block ${block.getClasses().join(" ")}`}
        onClick={toggleToolbar}
        data-typeblox-id={block.id}
        data-typeblox-editor="block"
        data-focused={isToolbarActive(block.id)}
      >
        {content ? (
          <span className="tbx-image-wrapper relative inline-block">
            <img
              src={content}
              alt="Uploaded"
              className={["", ...block.getClasses()].join(" ")}
              style={{
                ...block.getStyles(),
                width: dimensions.width,
                height: dimensions.height,
              }}
              {...block.getAttributes()}
            />
            {isToolbarActive(block.id) && (
              <div className="resize-handle" onMouseDown={handleResizeStart} />
            )}
          </span>
        ) : (
          <button className="tbx-placeholder" ref={buttonRef}>
            <Icon name="Photo" />
            <span>Select image</span>
          </button>
        )}
        <ContextualMenu
          referenceElement={buttonRef.current}
          isVisible={isMenuVisible}
          className="tbx-size-medium"
          content={
            <ImageUploadMenu
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
  },
);
