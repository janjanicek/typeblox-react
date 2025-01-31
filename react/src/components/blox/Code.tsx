import Icon from "../../components/Icon";
import React, { forwardRef, MouseEventHandler, useRef, useState } from "react";
import useBlockStore from "../../stores/BlockStore";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import { BLOCKS_SETTINGS } from "@typeblox/core/dist/constants";
import Tooltip from "../../components/Tooltip";

interface CodeBloxProps {
  content: string | null;
  block: Blox;
  onUpdate: (update: { id: string; content: string }) => void;
  setShowToolbar: (visible: boolean) => void;
  showToolbar: boolean;
  handleMouseUp: MouseEventHandler<HTMLDivElement>;
}

export const Code = forwardRef<HTMLDivElement, CodeBloxProps>(
  (
    { content, block, onUpdate, showToolbar, setShowToolbar, handleMouseUp },
    ref,
  ) => {
    const { selectedCodeLanguage, setSelectedCodeLanguage } = useBlockStore();
    const codeRef = useRef<HTMLDivElement | null>(null);
    const copyButtonRef = useRef<HTMLButtonElement | null>(null);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    // Attach the forwarded ref to the div element
    React.useImperativeHandle(ref, () => codeRef.current as HTMLDivElement);

    const copyToClipboard = () => {
      if (content) {
        navigator.clipboard.writeText(content.toString()).then(() => {
          setShowTooltip(true); // Show tooltip when copying
          setTimeout(() => setShowTooltip(false), 2000); // Hide tooltip after 2 seconds
        });
      }
    };

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
        <Tooltip content="Copied!" display={showTooltip}>
          <button
            ref={copyButtonRef}
            className="tbx-button tbx-small"
            onClick={copyToClipboard}
          >
            <Icon name="Copy" className="mr-2" />
          </button>
        </Tooltip>

        <pre>{renderContent()}</pre>
      </div>
    );
  },
);
