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
