import React, {
  FC,
  useState,
  useEffect,
  CSSProperties,
  ReactNode,
  isValidElement,
  cloneElement,
  forwardRef,
  ReactElement,
  Ref,
} from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  inline,
} from "@floating-ui/react-dom";
import { autoUpdate } from "@floating-ui/react";

interface TooltipsProps {
  content: string;
  children: ReactElement<{
    ref?: Ref<HTMLElement>;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }>;
  position?: "above" | "below";
  display?: boolean; // Controls tooltip visibility explicitly
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

const Tooltip: React.FC<TooltipsProps> = ({
  content,
  children,
  position = "above",
  display,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const { floatingStyles, refs } = useFloating({
    placement: position === "above" ? "top" : "bottom",
    middleware: [
      inline(),
      offset(8), // Adds space between the tooltip and the trigger element
      flip(), // Ensures the tooltip flips if it overflows the viewport
      shift({ padding: 8 }), // Prevents the tooltip from overflowing
    ],
    whileElementsMounted: autoUpdate,
  });

  // Local visibility state dynamically respects the `display` prop
  const isVisible = display !== undefined ? display : isHovered;

  const visibilityStyle: CSSProperties = isVisible
    ? {
        visibility: "visible",
        opacity: 1,
        zIndex: 5,
      }
    : {
        visibility: "hidden",
        opacity: 0,
        zIndex: 1,
      };

  if (!isValidElement(children)) {
    console.error("Tooltip children must be a valid React element.");
    return null;
  }

  // Merge refs for the child element if it supports ref
  const mergedRef = mergeRefs(
    refs.setReference,
    (children as any).ref, // Cast to allow accessing ref
  );

  const childWithHandlers = cloneElement(children, {
    ref: mergedRef,
    onMouseEnter: () => {
      setIsHovered(true);
      children.props.onMouseEnter?.();
    },
    onMouseLeave: () => {
      setIsHovered(false);
      children.props.onMouseLeave?.();
    },
  });

  return (
    <>
      {childWithHandlers}
      <div
        ref={refs.setFloating}
        role="tooltip"
        style={{
          position: "absolute",
          padding: "0.5rem 0.75rem",
          fontSize: "0.7rem",
          fontWeight: 500,
          color: "#fff",
          backgroundColor: "#1f2937",
          borderRadius: "0.375rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "opacity 0.3s",
          width: "auto",
          maxWidth: "250px",
          textAlign: "center",
          whiteSpace: "nowrap",
          ...visibilityStyle,
          ...floatingStyles,
        }}
      >
        {content}
      </div>
    </>
  );
};

export default Tooltip;
