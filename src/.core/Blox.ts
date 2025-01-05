import {
  selectAllTextInSelectedElement,
  applyFormat,
  unapplyFormat,
  getStyle,
} from "./format";
import { BlockType } from "./types";
import { EventEmitter } from "events";
import { EVENTS } from "./constants";

interface BloxProps {
  id: string;
  content: string;
  type: BlockType;
  onUpdate: Function;
}

export class Blox extends EventEmitter {
  id: string;
  contentElement: HTMLElement | null;
  content: string;
  onUpdate: Function;
  type: BlockType;

  constructor({ onUpdate, id, type, content }: BloxProps) {
    super();
    this.id = id ?? Date.now().toString();
    this.content = content;
    this.contentElement = this.getContentElement();
    this.onUpdate = onUpdate;
    this.type = type ?? "text";
  }

  getContentElement(): HTMLElement | null {
    return document.querySelector(`[data-typeblox-id="${this.id}"]`);
  }

  toggleBold(): boolean {
    const { isBold } = getStyle();
    !isBold ? applyFormat("strong") : unapplyFormat("strong"); // call event for update?
    selectAllTextInSelectedElement();
    this.emit(EVENTS.styleChange);
    return !isBold;
  }

  toggleItalic(): boolean {
    const { isItalic } = getStyle();
    !isItalic ? applyFormat("i") : unapplyFormat("i");
    selectAllTextInSelectedElement();
    this.emit(EVENTS.styleChange);
    return !isItalic;
  }

  toogleStrike(): boolean {
    const { isStrikeout } = getStyle();
    !isStrikeout ? applyFormat("s") : unapplyFormat("s");
    selectAllTextInSelectedElement();
    this.emit(EVENTS.styleChange);
    return !isStrikeout;
  }

  toogleUnderline(): boolean {
    const { isUnderline } = getStyle();
    !isUnderline ? applyFormat("u") : unapplyFormat("u");
    selectAllTextInSelectedElement();
    this.emit(EVENTS.styleChange);
    return !isUnderline;
  }

  applyStyle(tagName: string, style: Record<string, string>): void {
    applyFormat(tagName, style);
    selectAllTextInSelectedElement();
    this.emit(EVENTS.styleChange);
  }

  toggleType(newType: BlockType): void {
    this.type = newType === this.type ? "text" : newType;
    this.emit(EVENTS.styleChange);
    this.emit(EVENTS.blocksChanged);
  }
}
