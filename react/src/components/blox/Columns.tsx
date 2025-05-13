// Columns.tsx
import {
  forwardRef,
  useRef,
  useImperativeHandle,
  MouseEventHandler,
} from "react";
import { Blox } from "@typeblox/core/dist/classes/Blox";
import SortableItem from "../SortableItem";
import useEditorStore from "../../stores/EditorStore";

interface ColumnsProps {
  block: Blox;
  onUpdate: (update: { id: string; content?: string; type?: string }) => void;
  handleMouseUp: MouseEventHandler<HTMLDivElement>;
  dragListeners?: Record<string, any>;
}

export const Columns = forwardRef<HTMLDivElement, ColumnsProps>(
  ({ block, onUpdate, handleMouseUp, dragListeners = {} }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    // Expose the DOM node
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    // Grab classes & styles off the Blox itself
    const classes = block.getClasses().join(" ");
    const styles = block.getStyles();
    const { overId } = useEditorStore();

    // Outer wrapper: carries data attributes for Typeblox
    return (
      <div
        ref={containerRef}
        data-typeblox-editor="block"
        data-typeblox-id={block.id}
        data-tbx-block={block.type}
        className={`tbx-columns-wrapper ${classes}`}
        style={styles}
        onMouseUp={handleMouseUp}
      >
        <div className="tbx-columns">
          {block.columns.map((col) => {
            return (
              <div className="tbx-column">
                {col.blox.map((child) => (
                  <SortableItem
                    key={child.id}
                    block={child}
                    onUpdateBlock={onUpdate}
                    isOver={child.id === overId}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

export default Columns;
