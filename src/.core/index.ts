import { BLOCKS_SETTINGS } from "./constants";
import { Block, BlockType } from "./types";

const isEmptyContent = (content: string | null) =>
  !content || content === "" || content === "&nbsp;";

export interface TypedomInitOptions {
  elementSelector?: string; // Optional parameter
  HTMLString: string; // Required parameter
}

class Typedom {
  // Private properties
  private blocks: Block[] = [];

  // Private methods
  private parseHTMLToBlocks = (htmlString: string): Block[] => {
    // Parse the HTML string into a DOM Document
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Generate a unique ID generator
    let idCounter = 1;
    const generateId = () => (idCounter++).toString();

    // Map each top-level element to the desired structure
    const structure = Array.from(doc.body.children).map((element) => {
      const tagName = element.tagName.toLowerCase();

      // Find the corresponding block type in BLOCKS_SETTINGS
      const blockSetting = Object.values(BLOCKS_SETTINGS).find(
        (setting) => setting.tag === tagName,
      );

      if (blockSetting) {
        return {
          id: generateId(),
          type: blockSetting.blockName as BlockType,
          content:
            tagName === "img" // Special case for images
              ? element.getAttribute("src") || ""
              : element.innerHTML?.trim(),
        };
      }

      // Default block structure if the tag is not in BLOCKS_SETTINGS
      return {
        id: generateId(),
        type: "text" as BlockType, // Default block type
        content: element.innerHTML?.trim() || "Write your content here...",
      };
    });

    return structure;
  };

  private blocksToHTML = (blocks: Block[]) => {
    return blocks
      .map((block) => {
        if (isEmptyContent(block.content)) return "";
        const tagName = BLOCKS_SETTINGS[block.type].tag;
        return `<${tagName}>${block.content}</${tagName}>`;
      })
      .join("");
  };

  // Public methods
  public init(options: TypedomInitOptions): void {
    const { HTMLString } = options;
    if (HTMLString) this.blocks = this.parseHTMLToBlocks(HTMLString);
  }

  public update(onChange: Function, providedBlocks?: Block[]): void {
    onChange(this.blocksToHTML(providedBlocks ?? this.blocks));
  }

  public getBlocks(): Block[] {
    return this.blocks;
  }

  public setBlocks(blocks: Block[]): void {
    this.blocks = blocks;
  }
}

export const typedom = new Typedom();
