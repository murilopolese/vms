function copyArray(arr) {
  let n = []
  for(let y = 0; y < arr.length; y++) {
    n[y] = []
    for(let x = 0; x < arr[y].length; x++) {
      n[y][x] = arr[y][x]
    }
  }
  return n
}

function applyRules(grid, rules) {
  const rows = grid[0].length
  const columns = grid.length
  const stepTiles = copyArray(grid)
  for (let y = 1; y < rows-1; y++) {
    for (let x = 1; x < columns-1; x++) {
      // For each cell, check neighborhood
      let cell = grid[y][x]
      for (let i = 0; i < rules.length; i++) {
        let rule = rules[i]
        let [when, then] = rule
        // Check if the center of 'when' matches current cell
        if (when[1][1] === cell) {
          let startX = x-1
          let endX = x+2
          let aroundCell = [
            grid[Math.max(y-1, 0)].slice(startX, endX),
            grid[y].slice(startX, endX),
            grid[Math.min(y+1, grid.length)].slice(startX, endX)
          ]
          let matched = matchRule(aroundCell, when)
          if (matched) {
            for (let ly = 0; ly < then.length; ly++) {
              for (let lx = 0; lx < then[ly].length; lx++) {
                if (then[ly][lx] !== null) {
                  stepTiles[y-1+ly][x-1+lx] = then[ly][lx]
                }
              }
            }
          }
        }
      }
    }
  }
  grid = stepTiles
  return grid
}

function matchRule(around, when) {
  let matched = true
  for (let y = 0; y < when.length; y++) {
    for (let x = 0; x < when[y].length; x++) {
      if (when[y][x] !== null && when[y][x] !== around[y][x]) {
        matched = false
      }
    }
  }
  return matched
}
