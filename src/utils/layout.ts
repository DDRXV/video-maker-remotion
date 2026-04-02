import { CANVAS } from '../design-system/tokens';

export const SPACE = { xs: 8, sm: 16, md: 24, lg: 32, xl: 48, '2xl': 64, '3xl': 80, '4xl': 120 } as const;

export interface Rect { x: number; y: number; width: number; height: number; }
export interface Point { x: number; y: number; }

export function createGrid(cols = 12, rows = 8, margin = CANVAS.margin) {
  const usableW = CANVAS.width - margin * 2;
  const usableH = CANVAS.height - margin * 2;
  const colW = usableW / cols;
  const rowH = usableH / rows;
  return {
    cell(col: number, row: number, colSpan = 1, rowSpan = 1): Rect {
      return { x: margin + col * colW, y: margin + row * rowH, width: colSpan * colW, height: rowSpan * rowH };
    },
    center(): Point { return { x: CANVAS.width / 2, y: CANVAS.height / 2 }; },
    x(fraction: number): number { return margin + fraction * usableW; },
    y(fraction: number): number { return margin + fraction * usableH; },
    cellCenter(col: number, row: number, colSpan = 1, rowSpan = 1): Point {
      const r = this.cell(col, row, colSpan, rowSpan);
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    },
    distributeX(count: number, row: number, rowSpan = 1): Rect[] {
      const cellSpan = cols / count;
      return Array.from({ length: count }, (_, i) => this.cell(i * cellSpan, row, cellSpan, rowSpan));
    },
    left: margin, right: CANVAS.width - margin, top: margin, bottom: CANVAS.height - margin,
    colWidth: colW, rowHeight: rowH, margin,
  };
}

export const grid = createGrid();

export function anchors(r: Rect) {
  return {
    top: { x: r.x + r.width / 2, y: r.y } as Point,
    bottom: { x: r.x + r.width / 2, y: r.y + r.height } as Point,
    left: { x: r.x, y: r.y + r.height / 2 } as Point,
    right: { x: r.x + r.width, y: r.y + r.height / 2 } as Point,
    center: { x: r.x + r.width / 2, y: r.y + r.height / 2 } as Point,
  };
}
