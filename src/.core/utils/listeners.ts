export const registerListeners = (detectSelection: any) => {
  document.addEventListener("selectionchange", detectSelection);
};

export const removeListeners = (detectSelection: any) => {
  document.removeEventListener("selectionchange", detectSelection);
};
