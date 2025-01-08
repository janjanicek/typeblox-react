import { BlockType } from "../types";
import { EventEmitter } from "events";
import { BLOCKS_SETTINGS, EVENTS } from "../constants";
import type { TypingManager } from "../managers/TypingManager";
import type { FormatManager } from "../managers/FormatManager";
import { PasteManager } from ".core/managers/PasteManager";

interface BloxProps {
  id: string;
  content: string;
  type: BlockType;
  onUpdate: Function;
  TypingManager: TypingManager;
  FormatManager: FormatManager;
  PasteManager: PasteManager;
}

export class Blox extends EventEmitter {
  id: string;
  contentElement: HTMLElement | null;
  content: string;
  onUpdate: Function;
  type: BlockType;
  TypingManager: TypingManager;
  FormatManager: FormatManager;
  PasteManager: PasteManager;

  constructor({
    onUpdate,
    id,
    type,
    content,
    TypingManager,
    FormatManager,
    PasteManager,
  }: BloxProps) {
    super();
    this.id = id ?? Date.now().toString();
    this.content = content;
    this.TypingManager = TypingManager;
    this.FormatManager = FormatManager;
    this.PasteManager = PasteManager;
    this.contentElement = this.getContentElement();
    this.onUpdate = onUpdate;
    this.type = type ?? "text";
  }

  getContentElement(): HTMLElement | null {
    return document.querySelector(`[data-typeblox-id="${this.id}"]`);
  }

  public updateContent = () => {
    this.contentElement = this.getContentElement();
    this.content = this.getContentElement()?.innerHTML ?? "";
  };

  public getContent = () => {
    this.updateContent();
    return `<${BLOCKS_SETTINGS[this.type].tag}>${this.content}</${BLOCKS_SETTINGS[this.type].tag}>`;
  };

  public setContent = (contentString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentString, "text/html");
    const wrapperTag = BLOCKS_SETTINGS[this.type].tag;
    const wrapperElement = doc.body.querySelector(wrapperTag);
    console.log("setContent", wrapperElement);

    if (wrapperElement) {
      this.content = wrapperElement.innerHTML;
    } else {
      this.content = contentString;
    }

    if (this.contentElement) {
      this.contentElement.innerHTML = this.content;
    }

    this.emit(EVENTS.blocksChanged);
  };

  private executeWithCallbacks<T>(callback: () => T): T {
    this.beforeToggle();
    const result = callback();
    this.afterToggle();
    return result;
  }

  private beforeToggle(): void {
    this.TypingManager.saveSelectionRange();
    this.TypingManager.restoreSelectionRange();
  }

  private afterToggle(): void {
    this.TypingManager.selectAllTextInSelectedElement();
    this.emit(EVENTS.styleChange);
  }

  toggleBold(): boolean {
    return this.executeWithCallbacks(() => {
      const { isBold } = this.FormatManager.getStyle();
      if (document.queryCommandSupported("bold")) {
        document.execCommand("bold");
      } else {
        !isBold
          ? this.FormatManager.applyFormat("strong")
          : this.FormatManager.unapplyFormat("strong");
      }
      return !isBold;
    });
  }

  toggleItalic(): boolean {
    return this.executeWithCallbacks(() => {
      const { isItalic } = this.FormatManager.getStyle();
      if (document.queryCommandSupported("italic")) {
        document.execCommand("italic");
      } else {
        !isItalic
          ? this.FormatManager.applyFormat("i")
          : this.FormatManager.unapplyFormat("i");
      }
      return !isItalic;
    });
  }

  toggleStrike(): boolean {
    return this.executeWithCallbacks(() => {
      const { isStrikeout } = this.FormatManager.getStyle();
      if (document.queryCommandSupported("strikeThrough")) {
        document.execCommand("strikeThrough");
      } else {
        !isStrikeout
          ? this.FormatManager.applyFormat("s")
          : this.FormatManager.unapplyFormat("s");
      }
      return !isStrikeout;
    });
  }

  toggleUnderline(): boolean {
    return this.executeWithCallbacks(() => {
      const { isUnderline } = this.FormatManager.getStyle();
      if (document.queryCommandSupported("underline")) {
        document.execCommand("underline");
      } else {
        !isUnderline
          ? this.FormatManager.applyFormat("u")
          : this.FormatManager.unapplyFormat("u");
      }
      return !isUnderline;
    });
  }

  clearStyle(): void {
    return this.executeWithCallbacks(() => {
      if (document.queryCommandSupported("removeFormat")) {
        document.execCommand("removeFormat");
        console.warn("removeFormat");
      } else {
        this.FormatManager.clearFormat();
      }
    });
  }

  applyStyle(tagName: string, style: Record<string, string>): void {
    this.executeWithCallbacks(() => {
      this.FormatManager.applyFormat(tagName, style);
    });
  }

  toggleType(newType: BlockType): void {
    this.type = newType === this.type ? "text" : newType;
    this.emit(EVENTS.blocksChanged);
    this.emit(EVENTS.styleChange);
    setTimeout(() => this.TypingManager.selectAllTextInSelectedElement(), 50);
  }

  pasteContent(e: ClipboardEvent) {
    this.PasteManager.pasteContent(e);
    this.emit(EVENTS.blocksChanged);
  }
}
