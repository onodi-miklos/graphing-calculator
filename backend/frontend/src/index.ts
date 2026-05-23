import { createPlane, xMin, xMax } from "./plane.js";
import { evaluateExpression } from "./calculate.js";

createPlane();

interface GraphFunction {
  name: string;
  fn: string;
  color: string;
}

const COLORS = ["blue", "red", "black", "green", "aqua", "yellow"] as const;
const COLOR_TEXT = ["white", "white", "white", "white", "black", "black"] as const;

const letters: string[] = [
  "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
  "u", "v", "w", "a", "b", "c", "d", "e", "A", "B", "C", "D", "E", "F", "G",
  "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
];

let numberOfFunctions = 0;
let functions: GraphFunction[] = [];

const activesContainer: HTMLDivElement | null =
  document.querySelector("#actives");

function saveFunctionsToStorage(): void {
  sessionStorage.setItem("functions", JSON.stringify(functions));
}

function colorStringToNumber(colorString: string): number {
  const index = COLORS.indexOf(colorString as (typeof COLORS)[number]);
  return index >= 0 ? index : 0;
}

function applyColorToCell(el: HTMLDivElement, colorIndex: number): string {
  const slot = colorIndex % COLORS.length;
  const color = COLORS[slot];
  el.style.background = color;
  el.style.color = COLOR_TEXT[slot];
  return color;
}

function buildFunctionHtml(entry: GraphFunction): string {
  const { name, fn, color: colour } = entry;
  const label = `${name}(x) = ${fn}`;
  const lightColors: string[] = ["yellow", "aqua"];

  if (!lightColors.includes(colour)) {
    return `
      <div class="func">
        <h2 style="color: ${colour}">${label}</h2>
        <button class="delete" type="button">X</button>
      </div>
    `;
  }

  return `
    <div class="func">
      <h2 style="color: ${colour};background-color: grey">${label}</h2>
      <button class="delete" type="button">X</button>
    </div>
  `;
}

function rebuildActivesPanel(): void {
  if (!activesContainer) return;
  activesContainer.innerHTML = functions.map(buildFunctionHtml).join("");
}

function clearGrid(): void {
  document.querySelectorAll<HTMLDivElement>(".grid").forEach((e) => {
    e.style.background = "white";
    e.style.color = "black";
  });
}

function graph(
  func: string | null,
  colorIndex = -1,
  storedName = "",
  skipSidebar = false,
): void {
  if (!func) return;

  const slot =
    colorIndex >= 0 ? colorIndex % COLORS.length : numberOfFunctions % COLORS.length;
  let color: string = COLORS[slot];

  for (let i = xMin; i <= xMax; i++) {
    const y = Math.ceil(evaluateExpression(func, { x: i - 1 }));
    const el = document.querySelector<HTMLDivElement>(
      `div[data-c='{"x":${i},"y":${y + 1}}']`,
    );
    if (el) {
      color = applyColorToCell(el, slot);
    }
  }

  if (!skipSidebar) {
    addActiveFunction(func, color, storedName);
  }
}

function addActiveFunction(
  fn: string,
  colour: string,
  userName = "",
): void {
  const name = userName || letters[numberOfFunctions % letters.length];
  functions.push({ name, fn, color: colour });
  saveFunctionsToStorage();

  if (activesContainer) {
    activesContainer.innerHTML += buildFunctionHtml({ name, fn, color: colour });
  }
}

function redrawAll(): void {
  clearGrid();
  functions.forEach((entry) => {
    graph(entry.fn, colorStringToNumber(entry.color), entry.name, true);
  });
}

function removeFunction(index: number): void {
  if (index < 0 || index >= functions.length) return;
  functions.splice(index, 1);
  numberOfFunctions = functions.length;
  saveFunctionsToStorage();
  rebuildActivesPanel();
  redrawAll();
}

function graphAll(): void {
  const stored = sessionStorage.getItem("functions");
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored) as GraphFunction[];
    if (!Array.isArray(parsed) || parsed.length === 0) return;

    const seen = new Set<string>();
    functions = parsed.filter((entry) => {
      if (!entry?.fn || seen.has(entry.fn)) return false;
      seen.add(entry.fn);
      return true;
    });

    numberOfFunctions = functions.length;
    saveFunctionsToStorage();
    rebuildActivesPanel();
    redrawAll();
  } catch {
    sessionStorage.removeItem("functions");
  }
}

function clear(): void {
  clearGrid();
  numberOfFunctions = 0;
  functions = [];
  if (activesContainer) {
    activesContainer.innerHTML = "";
  }
  sessionStorage.removeItem("functions");
}

const button = document.querySelector<HTMLButtonElement>("#newExpr");
if (button) {
  button.onclick = (): void => {
    const newExpr = window.prompt("enter a function");
    graph(newExpr);
    if (newExpr) {
      numberOfFunctions++;
    }
  };
}

const clearBtn = document.querySelector<HTMLButtonElement>("#clearBtn");
if (clearBtn) {
  clearBtn.onclick = clear;
}

if (activesContainer) {
  activesContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList.contains("delete")) {
      return;
    }
    const row = target.closest(".func");
    if (!row || !activesContainer.contains(row)) return;
    const index = Array.from(activesContainer.children).indexOf(row);
    removeFunction(index);
  });
}

graphAll();
