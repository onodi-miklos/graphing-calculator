import { createPlane, xMin, xMax } from './plane.js'
createPlane()
import { evaluateExpression } from './calculate.js';

let numberOfFunctions: number = 0;


function graph(func: (string|null)):void{
  if (func) {
  for (let i: number = xMin-1 + 1; i <=xMax; i++) {
    // const x:number = i
    const y:number = Math.ceil(evaluateExpression(func, {x: i - 1}))
    const el: HTMLDivElement | null = document.querySelector(
      `div[data-c='{"x":${i},"y":${y + 1}}']`
    );
    // let isPlaceholder: boolean
    // if (y<1||x<-10){isPlaceholder = true}else{isPlaceholder = false};
    if (el) {
      switch(numberOfFunctions){
        case 1:
          el.style.background = "blue"
          el.style.color = "white"
          break
        case 2:
          el.style.background = "red"
          el.style.color = "white"
          break
        case 3:
          el.style.background = "black"
          el.style.color = "white"
          break
        case 4:
          el.style.background = "green"
          el.style.color = "white"
          break
        case 5:
          el.style.background = "aqua"
          el.style.color = "black"
          break
        case 6:
          el.style.background = "yellow"
          el.style.color = "black"
          break
        default:
          numberOfFunctions = 1
          el.style.background = "blue"
          el.style.color = "white"
          break

}}}}}
function clear(): void {
  const els = document.querySelectorAll<HTMLDivElement>('.grid')
  els.forEach(e => {
    e.style.background = 'white'
    e.style.color = "black"
  })
  numberOfFunctions = 0;
}


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