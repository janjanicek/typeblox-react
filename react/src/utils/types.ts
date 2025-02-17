import { CSSProperties } from "react";

export type imageUploadFunction = (
  blobInfo: any,
  success: Function,
  failure: Function,
) => void;

export type toolbarPositions = "top" | "bottom";

export type toolbarTypes = "inline" | "bar";

export type editorSettingsProps = {
  theme?: string;
  toolbarPosition?: toolbarPositions;
  toolbarType?: toolbarTypes;
  toolbarStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  containerStyle?: CSSProperties;
};
