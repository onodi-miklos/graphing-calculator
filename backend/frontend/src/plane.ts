const yMax: number = 11;
const yMin: number = -10;
const xMin: number = -9;
const xMax: number = 11;

function createPlane():void{
const plane: HTMLElement|null = document.getElementById('plane') as HTMLDivElement


// max-min+1


for (let j: number = yMax; j > yMin; j--) {
for ( let i: number = xMin; i <= xMax; i++ ) {
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
}

export { createPlane, xMax, xMin };