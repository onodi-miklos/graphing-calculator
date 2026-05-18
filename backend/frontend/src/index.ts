const plane: HTMLElement|null = document.getElementById('plane') as HTMLDivElement


for (let j: number = 21; j >=1; j--) {
for ( let i: number = 1; i <= 21; i++ ) {
      const grid:HTMLDivElement = document.createElement('div')
      
      if (j === 1) {
        grid.textContent = String( i-1 )
      }
      if (i === 1) {
        grid.textContent = String( j-1 )
      }

      grid.classList.add('grid')
      grid.dataset.c = JSON.stringify({x: i, y: j})
      grid.dataset.x = String(i)
      grid.dataset.y = String(j)

      if (plane) plane.append(grid)
}}


function evaluateExpression(
  expression: string,
  variables: Record<string, number> = {}
): number 
{
  // ^ operátor JS-kompatibilissé alakítása (**)
  let expr = expression.replace(/\^/g, "**");

  // Math függvények támogatása
  const allowedFunctions = [
    "sin",
    "cos",
    "tan",
    "sqrt",
    "log",
    "abs",
    "floor",
    "ceil",
    "round",
    "pow",
    "exp",
    "max",
    "min",
  ];

  for (const fn of allowedFunctions) {
    expr = expr.replace(
      new RegExp(`\\b${fn}\\b`, "g"),
      `Math.${fn}`
    );
  }

  // Változók behelyettesítése
  for (const [key, value] of Object.entries(variables)) {
    expr = expr.replace(
      new RegExp(`\\b${key}\\b`, "g"),
      value.toString()
    );
  }

  // Biztonsági ellenőrzés
  if (!/^[0-9+\-*/().,\s*Matha-zA-Z]*$/.test(expr)) {
    throw new Error("Érvénytelen karakter a kifejezésben");
  }

  // Kiértékelés
  return Function(`"use strict"; return (${expr})`)();
}
function graph():void{
  if (expr) {
  for (let i: number = 1 + 1; i <=21; i++) {
    const y:number = Math.ceil(evaluateExpression(expr, {x: i - 1}))
    const el: HTMLDivElement | null = document.querySelector(
      `div[data-c='{"x":${i},"y":${y + 1}}']`
    );
    let isPlaceholder: boolean
    if (y<1){isPlaceholder = true}else{isPlaceholder = false};
    if (el && !isPlaceholder) {
    el.style.background = "black"
}}}}
function clear(): void {
  const els = document.querySelectorAll<HTMLDivElement>('.grid')
  els.forEach(e => {
    e.style.background = 'white'
  })
}
let expr: string | null = window.prompt('enter a function')
const button = document.querySelector<HTMLButtonElement>('button')
if (button) {
  button.onclick = function():void{
    expr = window.prompt('enter a function')
    clear()
    graph()
  }
}
clear()
graph()