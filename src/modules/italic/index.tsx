import React from "react";
import Icon from "../../components/Icon";
import useBlockStore from "../../stores/BlockStore";
import { useFormatting } from "../../utils/FormattingContext";

export const Italic: React.FC = () => {
  const { isItalic, setDetectedStyles } = useBlockStore();
  const { applyFormatting, unapplyFormatting, detectStyle } = useFormatting();

  return (
    <button
      className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
        isItalic ? "bg-gray-300 text-white" : ""
      }`}
      onClick={() => {
        !isItalic ? applyFormatting("i") : unapplyFormatting("i");
        setDetectedStyles(detectStyle());
      }}
    >
      <Icon src="/icons/italic.svg" />
    </button>
  );
};
