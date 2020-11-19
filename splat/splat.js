function format_matrix(ruleArray) {
  const formatted = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
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

function Rule({ when, then }) {
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
            grid[y+_y-1][x+_x-1] = elements[element.name[0]]
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
            if (value.name[0] !== symbol) {
              matching = false
            }
        }
      }
    }
    return grid
  }
}

function Element({ name = 'empty', rules = [], color = 'white' }) {
  this.name = name
  this.rules = rules
  this.color = color
}

function clearGrid(grid) {
  if (!grid) grid = []
  for (let y = 0; y < GRID_SIZE; y++) {
    grid[y] = []
    for (let x = 0; x < GRID_SIZE; x++) {
      grid[y].push(new Element({}))
    }
  }
  return grid
}

let empty = new Element({
  name: 'empty',
  rules: []
})
let resource = new Element({
  name: 'resource',
  color: 'blue',
  rules: []
})
let yolo = new Element({
  name: 'yolo',
  color: 'pink',
  rules: [
    new Rule({
      when: ['@'],
      then: ['_']
    })
  ]
})
let falling = new Element({
  name: 'falling',
  color: 'brown',
  rules: [
    new Rule({
      when: [
        ['@'],
        ['_'],
      ],
      then: [
        ['_'],
        ['@'],
      ]
    })
  ]
})
let bomb = new Element({
  name: 'bomb',
  color: 'red',
  rules: [
    new Rule({
      when: ['@'],
      then: [
        ['@', '@', '@'],
        ['@', '@', '@'],
        ['@', '@', '@']
      ]
    })
  ]
})
let zombie = new Element({
  name: 'zombie',
  color: 'purple',
  rules: [
    new Rule({
      when: [
        [null, '?', null],
        [null, '@', null],
        [null, null, null],
      ],
      then: [
        [null, '@', null],
        [null, '@', null],
        [null, null, null],
      ],
    }),
    new Rule({
      when: [
        [null, null, '?'],
        [null, '@', null],
        [null, null, null],
      ],
      then: [
        [null, null, '@'],
        [null, '@', null],
        [null, null, null],
      ],
    }),
    new Rule({
      when: [
        [null, null, null],
        [null, '@', '?'],
        [null, null, null],
      ],
      then: [
        [null, null, null],
        [null, '@', '@'],
        [null, null, null],
      ],
    }),
    new Rule({
      when: [
        [null, null, null],
        [null, '@', null],
        [null, null, '?'],
      ],
      then: [
        [null, null, null],
        [null, '@', null],
        [null, null, '@'],
      ],
    }),
    new Rule({
      when: [
        [null, null, null],
        [null, '@', null],
        [null, '?', null],
      ],
      then: [
        [null, null, null],
        [null, '@', null],
        [null, '@', null],
      ],
    }),
    new Rule({
      when: [
        [null, null, null],
        [null, '@', null],
        ['?', null, null],
      ],
      then: [
        [null, null, null],
        [null, '@', null],
        ['@', null, null],
      ],
    }),
    new Rule({
      when: [
        [null, null, null],
        ['?', '@', null],
        [null, null, null],
      ],
      then: [
        [null, null, null],
        ['@', '@', null],
        [null, null, null],
      ],
    }),
    new Rule({
      when: [
        ['?', null, null],
        [null, '@', null],
        [null, null, null],
      ],
      then: [
        ['@', null, null],
        [null, '@', null],
        [null, null, null],
      ],
    }),
  ]
})
let swapline = new Element({
  name: 'swapline',
  color: 'cyan',
  rules: [
    new Rule({ // catch up
      when: [
        ['s', null, null],
        [null, '@', null],
        ['s', null, null]
      ],
      then: [
        ['.', null, null],
        [null, '.', null],
        ['.', null, null]
      ],
    }),
    new Rule({ // catch up
      when: [
        [null, null, null],
        [null, '@', null],
        ['s', null, null]
      ],
      then: [
        [null, null, null],
        [null, '.', null],
        ['.', null, null]
      ],
    }),
    new Rule({ // catch up
      when: [
        ['s', null, null],
        [null, '@', null],
        [null, null, null]
      ],
      then: [
        ['.', null, null],
        [null, '.', null],
        [null, null, null]
      ],
    }),
    new Rule({ // Swap on
      when: [
        [null, null, null],
        [null, '@', '_'],
        [null, null, null]
      ],
      then: [
        [null, null, null],
        [null, '_', '@'],
        [null, null, null]
      ],
    }),
  ]
})

let elements = {
  'e': empty,
  'y': yolo,
  'f': falling,
  'b': bomb,
  'z': zombie,
  'r': resource,
  's': swapline,
}

const GRID_SIZE = 16
let grid = clearGrid()
