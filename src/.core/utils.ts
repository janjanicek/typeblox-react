export const toCssStyle = (jsStyleKey: string) => {
  return jsStyleKey?.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
};

export function rgbToHex(rgb: string): string {
  // Match the `rgb(...)` or `rgba(...)` format
  const match = rgb.match(
    /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*[\d.]+)?\)/,
  );

  if (!match) {
    throw new Error(`Invalid rgb(a) format: ${rgb}`);
  }

  // Extract the red, green, and blue values
  const r = Math.min(255, parseInt(match[1], 10)); // Ensure within [0, 255]
  const g = Math.min(255, parseInt(match[2], 10));
  const b = Math.min(255, parseInt(match[3], 10));

  // Convert to hex
  const hex = `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
  return hex;
}

export const sanitizeHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Remove all style attributes from elements
  const elements = doc.body.querySelectorAll("*");
  elements.forEach((el) => {
    el.removeAttribute("style");
  });

  // Allow only certain tags
  const allowedTags = [
    "b",
    "i",
    "u",
    "a",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "blockquote",
  ];
  const sanitizeNode = (node: Element) => {
    if (!allowedTags.includes(node.tagName.toLowerCase())) {
      // Replace disallowed tags with their inner content
      const parent = node.parentNode;
      while (node.firstChild) {
        parent?.insertBefore(node.firstChild, node);
      }
      parent?.removeChild(node);
    }
  };

  doc.body.querySelectorAll("*").forEach(sanitizeNode);

  return doc.body.innerHTML; // Return the sanitized HTML
};
