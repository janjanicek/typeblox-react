import { CSSProperties } from "react";

export type imageUploadFunction = (
  blobInfo: any,
  success: Function,
  failure: Function,
) => void;

export type toolbarPositions = "top" | "bottom";

export type toolbarTypes = "inline" | "bar";

export type toolbarTargets = "editor" | "block" | "selection";

export type editorSettingsProps = {
  theme?: string;
  toolbarPosition?: toolbarPositions;
  toolbarType?: toolbarTypes;
  toolbarStyle?: CSSProperties;
  toolbarTarget?: toolbarTargets;
  contentStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  toolbarShowPermanently?: boolean;
};
