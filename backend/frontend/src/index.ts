const plane: HTMLElement|null = document.getElementById('plane') as HTMLDivElement




for (let j: number = 21; j >=1; j--) {
for ( let i: number = -9; i <= 11; i++ ) {
      const grid:HTMLDivElement = document.createElement('div')
      
      if (j === 1) {
        grid.textContent = String( i-1 )
      }
      if (i === -9) {
        grid.textContent = String( j-1 )
      }
      if (i === -9 && j === 1) {
        grid.textContent = ""
      }

      grid.classList.add('grid')
      grid.dataset.c = JSON.stringify({x: i, y: j})
      grid.dataset.x = String(i)
      grid.dataset.y = String(j)

      if (plane) plane.append(grid)
}}



let numberOfFunctions: number = 0;


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
function graph(func: (string|null)):void{
  if (func) {
  for (let i: number = -9 + 1; i <=11; i++) {
    const x:number = i
    const y:number = Math.ceil(evaluateExpression(func, {x: i - 1}))
    const el: HTMLDivElement | null = document.querySelector(
      `div[data-c='{"x":${i},"y":${y + 1}}']`
    );
    let isPlaceholder: boolean
    if (y<1||x<-10){isPlaceholder = true}else{isPlaceholder = false};
    if (el && !isPlaceholder) {
      switch(numberOfFunctions){
        case 1:
          el.style.background = "blue"
          break
        case 2:
          el.style.background = "red"
          break
        case 3:
          el.style.background = "black"
          break
        case 4:
          el.style.background = "green"
          break
        case 5:
          el.style.background = "aqua"
          break
        case 6:
          el.style.background = "yellow"
          break
        default:
          numberOfFunctions = 1
          el.style.background = "blue"
          break

}}}}}
function clear(): void {
  const els = document.querySelectorAll<HTMLDivElement>('.grid')
  els.forEach(e => {
    e.style.background = 'white'
  })
  numberOfFunctions = 1;
}

let expr: string | null = window.prompt('enter a function')
if (expr){numberOfFunctions++}
const button = document.querySelector<HTMLButtonElement>('#newExpr')
if (button) {
  button.onclick = function():void{
    let newExpr:string|null
    newExpr = window.prompt('enter a function')
    // clear()
    graph(newExpr)
    if (newExpr) {
      numberOfFunctions++
    }
  }
}
const clearBtn: HTMLButtonElement | null = document.querySelector('#clearBtn')
if (clearBtn) {
  clearBtn.onclick = clear
}
clear()
graph(expr)