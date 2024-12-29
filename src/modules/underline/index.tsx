import React from "react";
import Icon from "../../components/Icon";
import useBlockStore from "../../stores/BlockStore";
import { useFormatting } from "../../utils/FormattingContext";

export const Underline: React.FC = () => {
  const { isUnderline, setDetectedStyles } = useBlockStore();
  const { applyFormatting, unapplyFormatting, detectStyle } = useFormatting();

  return (
    <button
      className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
        isUnderline ? "bg-gray-300 text-white" : ""
      }`}
      onClick={() => {
        !isUnderline ? applyFormatting("u") : unapplyFormatting("u");
        setDetectedStyles(detectStyle());
      }}
    >
      <Icon src="/icons/underline.svg" />
    </button>
  );
};
