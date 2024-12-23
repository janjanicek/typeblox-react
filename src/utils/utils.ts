export const toCssStyle = (jsStyleKey: string) => {
  return jsStyleKey?.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
};
