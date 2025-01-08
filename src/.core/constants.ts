import { BlockType } from "./types";

export const AVAILABLE_FONTS = [
  "Arial",
  "Courier",
  "Times New Roman",
  "Verdana",
  "Tahoma",
  "Impact",
];

export const BLOCK_TYPES: Record<string, BlockType> = {
  text: "text",
  code: "code",
  image: "image",
  headline1: "headline1",
  headline2: "headline2",
  headline3: "headline3",
  html: "html",
};

export const AVAILABLE_BLOCKS: BlockType[] = [
  "text",
  "code",
  "image",
  "headline1",
  "headline2",
  "headline3",
  "html",
];

export const DEFAULT_BLOCK_TYPE = "text";

export const CLASSES = {
  selected: "typeblox-selected",
};

export const BLOCKS_SETTINGS = {
  headline1: {
    tag: "h1",
    visibleName: "Headline 1",
    blockName: BLOCK_TYPES.headline1,
    defaultContent: "Heading 1",
    description: "Big section heading.",
    toolbar: "type | font | italic underline strikethrough | color",
    icon: "icons/h-1.svg",
    availableTypes: [
      "text",
      "headline1",
      "headline2",
      "headline3",
      "code",
      "html",
    ],
  },
  headline2: {
    tag: "h2",
    visibleName: "Headline 2",
    blockName: BLOCK_TYPES.headline2,
    defaultContent: "Heading 2",
    description: "Medium section heading.",
    toolbar: "type | font | italic underline strikethrough | color",
    icon: "icons/h-2.svg",
    availableTypes: [
      "text",
      "headline1",
      "headline2",
      "headline3",
      "code",
      "html",
    ],
  },
  headline3: {
    tag: "h3",
    visibleName: "Headline 3",
    blockName: BLOCK_TYPES.headline3,
    defaultContent: "Heading 3",
    description: "Small section heading.",
    toolbar: "type | font | italic underline strikethrough | color",
    icon: "icons/h-3.svg",
    availableTypes: [
      "text",
      "headline1",
      "headline2",
      "headline3",
      "code",
      "html",
    ],
  },
  text: {
    tag: "p",
    visibleName: "Text",
    blockName: BLOCK_TYPES.text,
    description: "Just start writing with a simple text.",
    defaultContent: "Write something, or press '/' for commands...",
    toolbar:
      "type | font | bold italic underline strikethrough | color bgColor | viewCode",
    icon: "icons/align-left.svg",
    availableTypes: [
      "text",
      "headline1",
      "headline2",
      "headline3",
      "code",
      "html",
    ],
  },
  image: {
    tag: "img",
    visibleName: "Image",
    blockName: BLOCK_TYPES.image,
    defaultContent: "",
    toolbar: "size",
    icon: "icons/photo.svg",
    description: "Upload an image or embed it via link.",
    availableTypes: ["html"],
  },
  code: {
    tag: "code",
    visibleName: "Code",
    blockName: BLOCK_TYPES.code,
    defaultContent: "Write your code here...",
    toolbar: "type",
    icon: "icons/code.svg",
    description: "Write a code snippet.",
    availableTypes: [
      "text",
      "headline1",
      "headline2",
      "headline3",
      "code",
      "html",
    ],
  },
  html: {
    tag: "div",
    visibleName: "Free content",
    blockName: BLOCK_TYPES.html,
    description: "Type any content you want",
    defaultContent: "Write something, or press '/' for commands...",
    toolbar:
      "type | font | bold italic underline strikethrough | color bgColor | viewCode",
    icon: "icons/article.svg",
    availableTypes: ["text", "code"],
  },
};

export const DEFAULT_TOOLBARS = {
  text: BLOCKS_SETTINGS["text"].toolbar,
  image: BLOCKS_SETTINGS["image"].toolbar,
  code: BLOCKS_SETTINGS["code"].toolbar,
  headline1: BLOCKS_SETTINGS["headline1"].toolbar,
  headline2: BLOCKS_SETTINGS["headline2"].toolbar,
  headline3: BLOCKS_SETTINGS["headline3"].toolbar,
  html: BLOCKS_SETTINGS["html"].toolbar,
};

export const EVENTS = {
  blocksChanged: "typeblox.blocksChanged",
  styleChange: "typeblox.styleChanges",
  selectionChange: "typeblox.selectionChange",
};
