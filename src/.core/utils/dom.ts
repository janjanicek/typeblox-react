export const removeElement = (matchingParent: Element) => {
  const parentElement = matchingParent.parentElement;
  while (matchingParent.firstChild) {
    parentElement?.insertBefore(matchingParent.firstChild, matchingParent);
  }
  parentElement?.removeChild(matchingParent);
};

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
