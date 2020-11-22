function format_matrix(ruleArray) {
  const formatted = [
    ['.', '.', '.'],
    ['.', '.', '.'],
    ['.', '.', '.']
  ]
  let offsetX = 0
  let offsetY = 0
  if (ruleArray.length < 3) {
    offsetY = 1
  }
  if (ruleArray[0].length < 3) {
    offsetX = 1
  }

  for (let y = 0; y < ruleArray.length; y++) {
    for (let x = 0; x < ruleArray[y].length; x++) {
      formatted[y+offsetY][x+offsetX] = ruleArray[y][x]
    }
  }

  return formatted
}

function Rule({ when = [[]], then = [[]] }) {
  this.when = format_matrix(when)
  this.then = format_matrix(then)

  this.match = function(grid, x, y) {
    let element = grid[y][x]
    // console.log('will try to match rule', this.when)
    let matching = true
    for (let _y = 0; _y < 3; _y++) {
      for (let _x = 0; _x < 3; _x++) {
        let symbol = this.when[_y][_x]
        let value = grid[y+_y-1][x+_x-1]
        switch (symbol) {
          case '@':
            if (value.name !== element.name) {
              matching = false
            }
            break
          case '.':
            // it could be anything here
            break
          case '?':
            if (value.name === empty.name) {
              matching = false
            }
            break;
          case '_':
            if (value.name !== empty.name) {
              matching = false
            }
            break;
          case null:
            // Do nothing
            break
          default:
            if (value.name[0] !== symbol) {
              matching = false
            }
        }
      }
    }
    return matching
  }

  this.apply = function(grid, x, y) {
    let element = grid[y][x]
    // console.log('applying rule', this.then)
    for (let _y = 0; _y < 3; _y++) {
      for (let _x = 0; _x < 3; _x++) {
        let symbol = this.then[_y][_x]
        switch (symbol) {
          case '@':
            grid[y+_y-1][x+_x-1] = elements[element.name]
            break
          case '.':
          case '?':
          case null:
            // Do nothing
            break
          case '_':
              grid[y+_y-1][x+_x-1] = empty
            break;
          default:
            grid[y+_y-1][x+_x-1] = elements[symbol]
        }
      }
    }
    return grid
  }
}

function Element({ name = '_', rules = [], color = 'white' }) {
  this.name = name
  this.rules = rules
  this.color = color
}

let empty = new Element({ name: '_'})
function clearGrid(grid) {
  if (!grid) grid = []
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid[y] = []
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid[y].push(empty)
    }
  }
  return grid
}

let elements = {}

for (let i = 65; i < 91; i++) {
  let c = String.fromCharCode(i)
  elements[c] = new Element({ name: `${c}` })
}

const GRID_WIDTH = 30
const GRID_HEIGHT = 30
let grid = clearGrid()

module.exports = {
  GRID_WIDTH,
  GRID_HEIGHT,
  Rule: Rule,
  Element: Element,
  grid: grid,
  elements: elements,
  clearGrid: clearGrid
}
