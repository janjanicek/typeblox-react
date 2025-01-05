import { BLOCKS_SETTINGS, CLASSES, EVENTS } from "./constants";
import { Block, BlockType, CustomRange, detectedStyles } from "./types";
import { EventEmitter } from "events";
import { Blox } from "./Blox";
import { getBlockElement, getBlockElementById } from "./blocks";
import { createSelectedElement, getStyle, removeSelection } from "./format";
import { registerListeners, removeListeners } from "./utils/listeners";
import { HistoryManager } from "./HistoryManager";

const isEmptyContent = (content: string | null) =>
  !content || content === "" || content === "&nbsp;";

export interface TypeBloxInitOptions {
  elementSelector?: string; // Optional parameter
  HTMLString: string; // Required parameter
  onUpdate: Function;
}

export class Typeblox extends EventEmitter {
  private blocks: Blox[] = [];

  private HistoryManager: HistoryManager;

  private currentStyles: detectedStyles = {
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikeout: false,
    color: "#000000",
    backgroundColor: "#ffffff",
    fontFamily: "arial",
    isH1: false,
    isH2: false,
    isH3: false,
    isParagraph: false,
    isCode: false,
  };

  public onChange: Function = (updatedHTMLString: string) => {
    sessionStorage.setItem("tempEditorContent", updatedHTMLString);
  };

  private currentSelection: CustomRange = { start: 0, end: 0 };

  isSameSelection(newStart: number, newEnd: number): boolean {
    const isSame =
      this.currentSelection.start === newStart &&
      this.currentSelection.end === newEnd;
    return isSame;
  }

  constructor() {
    super();
    this.currentStyles = this.getSelectionStyle();
    this.HistoryManager = new HistoryManager(25);
    registerListeners(this.detectSelection);
  }

  private updateCurrentStyles(block: Blox): void {
    const detectedStyles = this.getSelectionStyle();

    // Update `currentStyles` with the detected styles
    this.currentStyles = {
      ...this.currentStyles, // Retain other styles
      ...detectedStyles, // Update with the new styles from the block
    };

    // Optionally, emit a high-level styleChange event for external listeners
    this.emit(EVENTS.styleChange, this.currentStyles);
  }

  // Private methods
  private parseHTMLToBlocks = (htmlString: string): Blox[] => {
    // Parse the HTML string into a DOM Document
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Generate a unique ID generator
    let idCounter = 1;
    const generateId = () => (idCounter++).toString();

    // Map each top-level element to the desired structure
    const structure = Array.from(doc.body.children).map((element) => {
      const tagName = element.tagName.toLowerCase();
      let block = new Blox({
        id: generateId(),
        type: "text" as BlockType, // Default block type
        content: element.innerHTML?.trim() || "",
        onUpdate: this.onChange,
      });

      // Find the corresponding block type in BLOCKS_SETTINGS
      const blockSetting = Object.values(BLOCKS_SETTINGS).find(
        (setting) => setting.tag === tagName,
      );

      if (blockSetting) {
        block = new Blox({
          id: generateId(),
          type: blockSetting.blockName as BlockType,
          content:
            tagName === "img" // Special case for images
              ? element.getAttribute("src") || ""
              : element.innerHTML?.trim(),
          onUpdate: this.onChange,
        });
      }

      block.on(EVENTS.styleChange, () => {
        this.updateCurrentStyles(block);
      });
      block.on(EVENTS.blocksChanged, () => {
        this.update(this.onChange);
      });

      return block;
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
  public init(options: TypeBloxInitOptions): void {
    const { HTMLString, onUpdate } = options;
    if (HTMLString) this.blocks = this.parseHTMLToBlocks(HTMLString);
    if (onUpdate) this.onChange = onUpdate;
  }

  public destroy(): void {
    this.blocks = [];
    this.onChange = () => {};
    removeListeners(this.detectSelection);
  }

  public update(onChange: Function, providedBlocks?: Blox[]): void {
    const newBlocks = providedBlocks ?? this.blocks;
    this.blocks = newBlocks;
    onChange(this.blocksToHTML(newBlocks));
    this.saveHistory();
    this.emit(EVENTS.blocksChanged, this.blocks);
  }

  public getBlockById(id: string | undefined): Blox | undefined {
    return this.blocks?.find((block: Blox) => block.id === id);
  }

  public getBlockElementById(id: string | undefined): HTMLElement | null {
    if (!id) return null;
    return getBlockElementById(id);
  }

  public getBlocks(): Blox[] {
    return this.blocks;
  }

  public getSelectionStyle(): detectedStyles {
    return getStyle();
  }

  public getSelectionElement(): HTMLElement | null {
    const blockElement = getBlockElement();
    if (blockElement) {
      return blockElement.querySelector(`.${CLASSES.selected}`);
    }
    return null;
  }

  public unselect(element: HTMLElement | null): void {
    removeSelection(element);
    this.emit(EVENTS.selectionChange, this.currentStyles);
  }

  public select(range: Range): void {
    createSelectedElement(range);
    this.emit(EVENTS.selectionChange, this.currentStyles);
  }

  public isStyle(style: string): boolean {
    switch (style) {
      case "bold": {
        return this.currentStyles.isBold;
      }
      case "italic": {
        return this.currentStyles.isItalic;
      }
      case "underline": {
        return this.currentStyles.isUnderline;
      }
      case "strikethrough": {
        return this.currentStyles.isStrikeout;
      }
      default:
        break;
    }
    return false;
  }

  public getStyle(style: string): string {
    const styles: any = this.getSelectionStyle();
    return styles[style];
  }

  public getCurrentBlock(): Blox | null {
    const currentBlockElement = getBlockElement() as HTMLElement;
    if (currentBlockElement) {
      const blockId = currentBlockElement.dataset.typebloxId;
      if (blockId) {
        return this.getBlockById(blockId) ?? null;
      }
    }
    return null;
  }

  private detectSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const start = range.startOffset;
      const end = range.endOffset;

      // Get the parent element of the range
      const parentElement =
        range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement;

      const editorElement = (parentElement as HTMLElement)?.closest(
        "[data-typeblox-editor]",
      );

      if (editorElement && !this.isSameSelection(start, end)) {
        // console.warn("selection changed");
        this.currentSelection = { start, end };
        this.currentStyles = this.getSelectionStyle();
        this.emit(EVENTS.selectionChange, this.currentStyles);
      }
    }
  };

  private getCurrentDom = () => {
    return this.blocksToHTML(this.blocks);
  };

  private saveHistory = () => {
    this.HistoryManager.saveState(this.getCurrentDom());
  };

  private updateEditorContent = (newContent: string) => {
    this.blocks = this.parseHTMLToBlocks(newContent);
    this.emit(EVENTS.blocksChanged, this.blocks);
  };

  // Undo
  public handleUndo = () => {
    const previousState = this.HistoryManager?.undo(this.getCurrentDom());
    if (previousState) {
      this.updateEditorContent(previousState);
    }
  };

  // Redo
  public handleRedo = () => {
    const nextState = this.HistoryManager?.redo(this.getCurrentDom());
    if (nextState) {
      this.updateEditorContent(nextState);
    }
  };

  public getSelectedBlock() {}
}
