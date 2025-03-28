import React, { forwardRef, useRef, MouseEventHandler } from "react";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import { BLOCK_TYPES } from "@typeblox/core/dist/blockTypes";

interface ListBloxProps {
  content: string | null;
  block: Blox;
  onUpdate: (update: { id: string; content: string }) => void;
  handleMouseUp: MouseEventHandler<HTMLDivElement>;
}

export const List = forwardRef<HTMLDivElement, ListBloxProps>(
  ({ content, block, onUpdate, handleMouseUp }, ref) => {
    const listRef = useRef<HTMLDivElement | null>(null);

    // Attach the forwarded ref to the div element
    React.useImperativeHandle(ref, () => listRef.current as HTMLDivElement);

    const wrapperElement = React.createElement(
      block.type === BLOCK_TYPES.bulletedList ? "ul" : "ol",
      {
        ref: listRef,
        // onKeyDown: handleEnterKey,
        contentEditable: true,
        suppressContentEditableWarning: true,
        "data-typeblox-id": block.id,
        "data-typeblox-editor": block,
        className: `tbx-list-block flex-1 outline-none px-2 ${block.getClasses().join(" ")}`,
        style: block.getStyles(),
        onMouseUp: handleMouseUp,
        onBlur: () => {
          onUpdate({
            id: block.id,
            content: listRef.current?.innerHTML || "",
          });
        },
      },
      content,
    );

    return wrapperElement;
  },
);
