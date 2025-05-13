import type Typeblox from "@typeblox/core";
import type { Blox } from "@typeblox/core/dist/classes/Blox";

export const isParentOfCurrentBlock = (editor: Typeblox, block: Blox) => {
  const currentBlockId = editor.blox().getCurrentBlock()?.id;
  if (!currentBlockId) {
    return false;
  }
  return editor.blox().getParentBlockId(currentBlockId) === block.id;
};
