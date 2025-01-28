import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  MouseEventHandler,
} from "react";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import { BLOCK_TYPES } from "@typeblox/core/dist/constants";
import { useTypebloxEditor } from "../../context/EditorContext";

interface ListBloxProps {
  content: string | null;
  block: Blox;
  onUpdate: (update: { id: string; content: string }) => void;
  setShowToolbar: (visible: boolean) => void;
  showToolbar: boolean;
  handleMouseUp: MouseEventHandler<HTMLDivElement>;
}

export const List = forwardRef<HTMLDivElement, ListBloxProps>(
  (
    { content, block, onUpdate, showToolbar, setShowToolbar, handleMouseUp },
    ref,
  ) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const { editor } = useTypebloxEditor();
    const listRef = useRef<HTMLDivElement | null>(null);

    // Attach the forwarded ref to the div element
    React.useImperativeHandle(ref, () => listRef.current as HTMLDivElement);

    useEffect(() => {
      if (!content) {
        setIsMenuVisible(true);
      }
    }, [content]);

    const handleEnterKey = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        console.warn("enter");
        event.preventDefault();
        if (editor.selection().isCursorAtEnd()) {
          editor.elements().addElementAfter("li");
        } else {
          editor.elements().splitElementBySelector("li");
        }
      }
    };

    const wrapperElement = React.createElement(
      block.type === BLOCK_TYPES.bulletedList ? "ul" : "ol",
      {
        ref: listRef,
        onKeyDown: handleEnterKey,
        contentEditable: true,
        suppressContentEditableWarning: true,
        "data-typeblox-id": block.id,
        "data-typeblox-editor": block,
        className: `tbx-list-block  flex-1 outline-none px-2 ${block.getClasses().join(" ")}`,
        style: block.getStyles(),
        onMouseUp: handleMouseUp,
        onBlur: () =>
          onUpdate({
            id: block.id,
            content: listRef.current?.innerHTML || "",
          }),
      },
      content,
    );

    return wrapperElement;
  },
);
