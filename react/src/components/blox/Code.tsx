import React, { forwardRef, MouseEventHandler, useRef } from "react";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import { BLOCKS_SETTINGS } from "@typeblox/core/dist/blockTypes";

interface CodeBloxProps {
  content: string | null;
  block: Blox;
  onUpdate: (update: { id: string; content: string }) => void;
  handleMouseUp: MouseEventHandler<HTMLDivElement>;
}

export const Code = forwardRef<HTMLDivElement, CodeBloxProps>(
  ({ content, block, onUpdate, handleMouseUp }, ref) => {
    const codeRef = useRef<HTMLDivElement | null>(null);

    // Attach the forwarded ref to the div element
    React.useImperativeHandle(ref, () => codeRef.current as HTMLDivElement);

    const handleBlur = () => {
      const rawContent = codeRef.current?.innerHTML || "";

      // Sanitize and preserve newlines
      const sanitizedContent = rawContent
        .replace(/<br\s*\/?>/g, "\n") // Replace <br> tags with newlines
        .replace(/<\/?[^>]+(>|$)/g, "") // Remove all remaining HTML tags
        .replace(/&lt;/g, "<") // Decode HTML entity for less-than symbol
        .replace(/&gt;/g, ">") // Decode HTML entity for greater-than symbol
        .replace(/&amp;/g, "&") // Decode HTML entity for ampersand
        .replace(/&nbsp;/g, " "); // Replace non-breaking spaces with normal spaces

      // Replace newlines with <br> for visual representation
      const formattedContent = sanitizedContent;

      onUpdate({
        id: block.id,
        content: formattedContent,
      });
    };

    const renderContent = () => {
      return React.createElement(
        "code",
        {
          ref: codeRef,
          "data-typeblox-editor": "block",
          "data-typeblox-id": block.id,
          placeholder: BLOCKS_SETTINGS[block.type].placeholder,
          contentEditable: true,
          suppressContentEditableWarning: true,
          className: `outline-none tbx-pre ${block.getClasses().join(" ")}`,
          style: block.getStyles(),
          onMouseUp: handleMouseUp,
          onBlur: handleBlur,
        },
        content,
      );
    };

    return (
      <div className="tbx-code-block">
        <pre>{renderContent()}</pre>
      </div>
    );
  },
);
