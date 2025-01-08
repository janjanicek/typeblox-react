import { BLOCKS_SETTINGS, CLASSES, EVENTS } from "./constants";
import { BlockType, CustomRange, detectedStyles } from "./types";
import { EventEmitter } from "events";
import { Blox } from "./classes/Blox";
import { FormatManager } from "./managers/FormatManager";
import { registerListeners, removeListeners } from "./utils/listeners";
import { HistoryManager } from "./managers/HistoryManager";
import { TypingManager } from "./managers/TypingManager";
import { DOMManager } from "./managers/DOMManager";
import { PasteManager } from "./managers/PasteManager";

export interface TypeBloxInitOptions {
  elementSelector?: string; // Optional parameter
  HTMLString: string; // Required parameter
  onUpdate: Function;
}

export class Typeblox extends EventEmitter {
  private blocks: Blox[] = [];

  private HistoryManager: HistoryManager;

  private TypingManager: TypingManager;

  private FormatManager: FormatManager;

  private DOMManager: DOMManager;

  private PasteManager: PasteManager;

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
    this.DOMManager = new DOMManager();
    this.PasteManager = new PasteManager(this.DOMManager);
    this.HistoryManager = new HistoryManager(25);
    this.TypingManager = new TypingManager();
    this.FormatManager = new FormatManager(this.TypingManager, this.DOMManager);
    this.currentStyles = this.getSelectionStyle();
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
        TypingManager: this.TypingManager,
        FormatManager: this.FormatManager,
        PasteManager: this.PasteManager,
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
          TypingManager: this.TypingManager,
          FormatManager: this.FormatManager,
          PasteManager: this.PasteManager,
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

  public selection(): TypingManager {
    return this.TypingManager;
  }

  public format(): FormatManager {
    return this.FormatManager;
  }

  public DOM(): DOMManager {
    return this.DOMManager;
  }

  public paste(): PasteManager {
    return this.PasteManager;
  }

  public update(
    onChange: Function,
    providedBlocks?: Blox[],
    calledFromEditor?: false,
  ): void {
    const newBlocks = providedBlocks ?? this.blocks;
    this.blocks = newBlocks;
    onChange(this.DOMManager.blocksToHTML(newBlocks));
    this.saveHistory();
    if (!calledFromEditor) this.emit(EVENTS.blocksChanged, this.blocks);
  }

  public getBlockById(id: string | undefined): Blox | undefined {
    return this.blocks?.find((block: Blox) => block.id === id);
  }

  public getBlockElementById(id: string | undefined): HTMLElement | null {
    if (!id) return null;
    return this.DOMManager.getBlockElementById(id);
  }

  public getBlocks(): Blox[] {
    return this.blocks;
  }

  public getSelectionStyle(): detectedStyles {
    return this.format().getStyle();
  }

  public getSelectionElement(): HTMLElement | null {
    const blockElement = this.DOMManager.getBlockElement();
    if (blockElement) {
      return blockElement.querySelector(`.${CLASSES.selected}`);
    }
    return null;
  }

  public unselect(element: HTMLElement | null, callBack?: () => void): void {
    let currentSelection = element;
    if (!currentSelection) currentSelection = this.getSelectionElement();

    try {
      this.TypingManager.removeSelection(currentSelection);
    } catch (error) {
      console.error("Error removing selection:", error);
      return;
    }
    this.handleSelectionChange();
    this.executeCallback(callBack);
  }

  public select(range: Range, callBack?: () => void): void {
    try {
      this.TypingManager.createSelectedElement(range);
    } catch (error) {
      console.error("Error creating selected element:", error);
      return;
    }
    this.handleSelectionChange();
    this.executeCallback(callBack);
  }

  private executeCallback(callBack?: () => void): void {
    if (callBack && typeof callBack === "function") {
      try {
        callBack();
      } catch (error) {
        console.error("Error executing callback:", error);
      }
    }
  }

  private handleSelectionChange(): void {
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
    const currentBlockElement =
      this.DOMManager.getBlockElement() as HTMLElement;
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
        this.currentSelection = { start, end };
        this.currentStyles = this.getSelectionStyle();
        this.emit(EVENTS.selectionChange, this.currentStyles);
      }
    }
  };

  private getCurrentDom = () => {
    return this.DOMManager.blocksToHTML(this.blocks);
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
