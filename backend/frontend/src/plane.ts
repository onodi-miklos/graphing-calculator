let WORLD_X_MIN: number;
let WORLD_X_MAX: number;
let WORLD_Y_MIN: number;
let WORLD_Y_MAX: number;
let xIter: number;
let yIter: number;

function setSizes(size: number, iteratition: number): void {
  WORLD_X_MAX = size;
  WORLD_X_MIN = -size;
  WORLD_Y_MAX = size;
  WORLD_Y_MIN = -size;
  xIter = iteratition;
  yIter = iteratition;
}
function setPlaneSize(): void {
  let planeSize: number | null = Math.round(Number(window.prompt("Set plane size (number)")));

  if (!planeSize){planeSize=10}

  if (planeSize <= 10) {
    setSizes(planeSize, 0.2);
  } else if (planeSize <= 15) {
    setSizes(planeSize, 0.5);
  } else if (planeSize <= 35) {
    setSizes(planeSize, 1);
  } else {
    window.alert("too big plane");
    setPlaneSize()
  }
}
setPlaneSize()

function gridColumnCount(): number {
  return Math.round((WORLD_X_MAX - WORLD_X_MIN) / xIter) + 1;
}

function gridRowCount(): number {
  return Math.round((WORLD_Y_MAX - WORLD_Y_MIN) / yIter) + 1;
}

function worldXAtCol(col: number): number {
  return WORLD_X_MIN + col * xIter;
}

function worldYAtRow(row: number): number {
  return WORLD_Y_MAX - row * yIter;
}

function colAtWorldX(worldX: number): number {
  return Math.round((worldX - WORLD_X_MIN) / xIter);
}

function rowAtWorldY(worldY: number): number {
  return Math.round((WORLD_Y_MAX - worldY) / yIter);
}

function snapWorldY(worldY: number): number {
  return Math.round(worldY / yIter) * yIter;
}

function isNearInteger(n: number): boolean {
  return Math.abs(n - Math.round(n)) < 1e-6;
}

function formatAxisLabel(n: number): string {
  return String(Math.round(n));
}

function isOnXAxis(worldY: number): boolean {
  return Math.abs(worldY) < yIter / 2 + 1e-9;
}

function isOnYAxis(worldX: number): boolean {
  return Math.abs(worldX) < xIter / 2 + 1e-9;
}

function createPlane(): void {
  const plane = document.getElementById("plane") as HTMLDivElement | null;
  if (!plane) return;

  const cols = gridColumnCount();
  const rows = gridRowCount();

  plane.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  plane.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  for (let row = 0; row < rows; row++) {
    const worldY = worldYAtRow(row);
    for (let col = 0; col < cols; col++) {
      const worldX = worldXAtCol(col);
      const grid = document.createElement("div");

      grid.classList.add("grid");
      grid.dataset.col = String(col);
      grid.dataset.row = String(row);
      0;
      if (isOnXAxis(worldY) && isNearInteger(worldX)) {
        grid.textContent = formatAxisLabel(worldX);
        grid.classList.add("axis-label");
      } else if (isOnYAxis(worldX) && isNearInteger(worldY)) {
        grid.textContent = formatAxisLabel(worldY);
        grid.classList.add("axis-label");
      }

      if (isOnXAxis(worldY)) {
        grid.classList.add("axis-x");
      }
      if (isOnYAxis(worldX)) {
        grid.classList.add("axis-y");
      }

      plane.append(grid);
    }
  }
}

export {
  createPlane,
  gridColumnCount,
  gridRowCount,
  worldXAtCol,
  rowAtWorldY,
  snapWorldY,
  xIter,
  yIter,
};
