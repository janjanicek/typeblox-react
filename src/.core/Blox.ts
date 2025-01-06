import { BlockType } from "./types";
import { EventEmitter } from "events";
import { EVENTS } from "./constants";
import type { TypingManager } from "./managers/TypingManager";
import type { FormatManager } from "./managers/FormatManager";

interface BloxProps {
  id: string;
  content: string;
  type: BlockType;
  onUpdate: Function;
  TypingManager: TypingManager;
  FormatManager: FormatManager;
}

export class Blox extends EventEmitter {
  id: string;
  contentElement: HTMLElement | null;
  content: string;
  onUpdate: Function;
  type: BlockType;
  TypingManager: TypingManager;
  FormatManager: FormatManager;

  constructor({
    onUpdate,
    id,
    type,
    content,
    TypingManager,
    FormatManager,
  }: BloxProps) {
    super();
    this.id = id ?? Date.now().toString();
    this.content = content;
    this.TypingManager = TypingManager;
    this.FormatManager = FormatManager;
    this.contentElement = this.getContentElement();
    this.onUpdate = onUpdate;
    this.type = type ?? "text";
  }

  getContentElement(): HTMLElement | null {
    return document.querySelector(`[data-typeblox-id="${this.id}"]`);
  }

  private executeWithCallbacks<T>(callback: () => T): T {
    this.beforeToggle();
    const result = callback();
    this.afterToggle();
    return result;
  }

  private beforeToggle(): void {
    console.log("Before toggle logic...");
  }

  private afterToggle(): void {
    this.TypingManager.selectAllTextInSelectedElement();
    this.emit(EVENTS.styleChange);
  }

  toggleBold(): boolean {
    return this.executeWithCallbacks(() => {
      const { isBold } = this.FormatManager.getStyle();
      !isBold
        ? this.FormatManager.applyFormat("strong")
        : this.FormatManager.unapplyFormat("strong");
      return !isBold;
    });
  }

  toggleItalic(): boolean {
    return this.executeWithCallbacks(() => {
      const { isItalic } = this.FormatManager.getStyle();
      !isItalic
        ? this.FormatManager.applyFormat("i")
        : this.FormatManager.unapplyFormat("i");
      return !isItalic;
    });
  }

  toggleStrike(): boolean {
    return this.executeWithCallbacks(() => {
      const { isStrikeout } = this.FormatManager.getStyle();
      !isStrikeout
        ? this.FormatManager.applyFormat("s")
        : this.FormatManager.unapplyFormat("s");
      return !isStrikeout;
    });
  }

  toggleUnderline(): boolean {
    return this.executeWithCallbacks(() => {
      const { isUnderline } = this.FormatManager.getStyle();
      !isUnderline
        ? this.FormatManager.applyFormat("u")
        : this.FormatManager.unapplyFormat("u");
      return !isUnderline;
    });
  }

  applyStyle(tagName: string, style: Record<string, string>): void {
    this.executeWithCallbacks(() => {
      this.FormatManager.applyFormat(tagName, style);
    });
  }

  toggleType(newType: BlockType): void {
    this.executeWithCallbacks(() => {
      this.type = newType === this.type ? "text" : newType;
      this.emit(EVENTS.blocksChanged);
    });
  }
}
