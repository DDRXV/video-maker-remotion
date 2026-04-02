const CHAR_WIDTH_REGULAR = 0.52;
const CHAR_WIDTH_BOLD = 0.56;

export function measureText(text: string, fontSize: number, fontWeight: number | string = 400): number {
  const isBold = typeof fontWeight === 'number' ? fontWeight >= 600 : fontWeight === 'bold';
  return text.length * fontSize * (isBold ? CHAR_WIDTH_BOLD : CHAR_WIDTH_REGULAR);
}

export function wrapText(text: string, maxWidth: number, fontSize: number, fontWeight: number | string = 400): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (measureText(test, fontSize, fontWeight) > maxWidth && current) { lines.push(current); current = word; }
    else { current = test; }
  }
  if (current) lines.push(current);
  return lines;
}
