import React from "react";
import Icon from "../../components/Icon";
import useBlockStore from "../../stores/BlockStore";
import { useFormatting } from "../../utils/FormattingContext";

export const Bold: React.FC = () => {
  const { isBold, setDetectedStyles } = useBlockStore();
  const { applyFormatting, unapplyFormatting, detectStyle } = useFormatting();

  return (
    <button
      className={`px-2 py-1 border-0 rounded hover:bg-gray-100 ${
        isBold ? "bg-gray-300 text-white" : ""
      }`}
      onClick={() => {
        !isBold ? applyFormatting("strong") : unapplyFormatting("strong");
        setDetectedStyles(detectStyle());
      }}
    >
      <Icon src="/icons/bold.svg" />
    </button>
  );
};
