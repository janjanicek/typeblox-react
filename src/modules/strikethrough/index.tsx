import React from "react";
import Icon from "../../components/Icon";
import useBlockStore from "../../stores/BlockStore";
import { useFormatting } from "../../utils/FormattingContext";

export const Strikethrough: React.FC = () => {
  const { isStrikeout, setDetectedStyles } = useBlockStore();
  const { applyFormatting, unapplyFormatting, detectStyle } = useFormatting();

  return (
    <button
      className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
        isStrikeout ? "bg-gray-300 text-white" : ""
      }`}
      onClick={() => {
        !isStrikeout ? applyFormatting("s") : unapplyFormatting("s");
        setDetectedStyles(detectStyle());
      }}
    >
      <Icon src="/icons/strikethrough.svg" />
    </button>
  );
};
