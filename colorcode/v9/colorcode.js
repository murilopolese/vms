const elements = {}
const sys_color = [30, 50, '#123', '#aaa']
const colors = [
  '#000000', '#2b335f', '#7e2072', '#19959c',
  '#8b4852', '#395c98', '#a9c1ff', '#eeeeee',
  '#d4186c', '#d38441', '#e9c35b', '#70c6a9',
  '#7696de', '#a3a3a3', '#ff9798', '#edc7b0',
]
const eventNames = ['tick', 'up', 'right', 'down', 'left', 'a', 'b', 'hack']
let speed = 15
let res, canvas

let nGrids = 4

let state = {
  selectedGrid: 0,
  grids: [],
  rules: [],
  cursor: [3, 5],
  selectedColor: 2,
  selectedRule: 0,
  selectedEvent: 0,
  view: 'edit',
  columns: 16,
  rows: 16
}

for (let i = 0; i < nGrids; i++) {
  state.grids[i] = []
  for (let y = 0; y < state.rows; y++) {
    state.grids[i][y] = []
    for (let x = 0; x < state.columns; x++) {
      state.grids[i][y][x] = 0
    }
  }
}
// Draw walls
for (let i = 0; i < nGrids; i++) {
  for (let y = 0; y < state.rows; y++) {
    state.grids[i][y][0] = 1
    state.grids[i][y][state.columns-1] = 1
  }
  for (let x = 0; x < state.columns; x++) {
    state.grids[i][0][x] = 1
    state.grids[i][state.rows-1][x] = 1
  }
}

for (let i = 0; i < nGrids; i++) {
  state.rules[i] = []
  for (let events = 0; events < eventNames.length; events++) {
    state.rules[i][events] = []
    for (let rules = 0; rules < 32; rules++) {
      let when = []
      let then = []
      for (let i = 0; i < 3; i++) {
        when[i] = []
        then[i] = []
        for (let j = 0; j < 3; j++) {
          when[i][j] = null
          then[i][j] = null
        }
      }
      state.rules[i][events][rules] = [when, then]
    }
  }
}

let keysPressed = []

const colorCodeContext = (sketch) => {
  // P5JS stuff
  let canvas
  sketch.setup = () => {
    let rem = sketch.windowWidth/100
    canvas = sketch.createCanvas(40*rem, 40*rem)
    sketch.angleMode(sketch.DEGREES)
    res = (canvas.width/state.columns)
    sketch.background(colors[0])
    state.view = 'play'
  }

  sketch.draw = () => {
    res = (canvas.width/state.columns)
    sketch.background(colors[0])
    state = sketch.update(state)
    sketch.renderPlay(state)
  }

  sketch.renderPlay = (state) => {
    let { grids, selectedGrid } = state
    let grid = grids[selectedGrid]
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        let value = grid[y][x]
        let color = colors[0]
        if (value !== null && value !== '') {
          value = parseInt(value)
          color = colors[value]
        }
        sketch.fill(color)
        sketch.stroke(color)
        sketch.square(x*res, y*res, res)
      }
    }
  }

  sketch.update = (state) => {
    let x = sketch.map(sketch.mouseX, 0, sketch.width, 0, state.columns)
    let y = sketch.map(sketch.mouseY, 0, sketch.height, 0, state.rows)
    state.cursor = [ parseInt(x), parseInt(y) ]
    if (state.view === 'play' && sketch.frameCount % 5 == 0) {
      state = applyRules(state, 'tick')
    }
    return state
  }

  sketch.keyPressed = (e) => {
    if (typeof e === 'string') {
      sketch.key = e
    } else {
      e.preventDefault()
    }
    if (Number.isFinite(parseInt(sketch.key))) {
      state.selectedColor = parseInt(sketch.key)
    }
    if (state.view === 'play') {
      state = handleEventPlay(state, sketch.key)
    }
  }

  sketch.mousePressed = () => {
    if (
      sketch.mouseX > 0
      && sketch.mouseY > 0
      && sketch.mouseX < sketch.width
      && sketch.mouseY < sketch.height
    ) {
      state = setTileMapColor(state)
    }
  }

  sketch.mouseDragged = () => {
    if (
      sketch.mouseX > 0
      && sketch.mouseY > 0
      && sketch.mouseX < sketch.width
      && sketch.mouseY < sketch.height
    ) {
      state = setTileMapColor(state)
    }
  }

  sketch.windowResized = () => {
    let rem = sketch.windowWidth/100
    sketch.resizeCanvas(40*rem, 40*rem);
  }
}



// COLOR "ENGINE"?

function handleEventPlay(state, key) {
  switch (key) {
    case 'ArrowUp':
      state = applyRules(state, 'up')
      break;
    case 'ArrowRight':
      state = applyRules(state, 'right')
      break;
    case 'ArrowDown':
      state = applyRules(state, 'down')
      break;
    case 'ArrowLeft':
      state = applyRules(state, 'left')
      break;
    case 'z':
      state = applyRules(state, 'a')
      break;
    case 'x':
      state = applyRules(state, 'b')
      break;
    case 'c':
      state = togglePlayView(state)
      break;
    default:

  }
  return state
}

function applyRules(state, eventName) {
  let { grids, rules, rows, columns } = state
  for (let selectedGrid = 0; selectedGrid < 4; selectedGrid++) {
    let grid = grids[selectedGrid]
    let currentRules = rules[selectedGrid]
    let index = eventNames.indexOf(eventName)
    let eventRules = currentRules[index]
    let stepTiles = copyArray(grid)
    for (let y = 1; y < rows-1; y++) {
      for (let x = 1; x < columns-1; x++) {
        // For each cell, check neighborhood
        let cell = grid[y][x]
        for (let i = 0; i < eventRules.length; i++) {
          let rule = eventRules[i]
          let [when, then] = rule
          // Check if the center of 'when' matches current cell
          if (when[1][1] === cell) {
            let startX = x-1
            let endX = x+2
            let aroundCell = [
              grid[          Math.max(y-1, 0)].slice(startX, endX),
              grid[                          y ].slice(startX, endX),
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
    state.grids[selectedGrid] = stepTiles
  }
  return state
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

function setTileMapColor(state) {
  let { selectedColor, selectedGrid, cursor } = state
  let [ x, y ] = cursor
  state.grids[selectedGrid][y][x] = selectedColor
  return state
}

function selectEvent(state, i) {
  state.selectedEvent = i
  return state
}

function selectColor(state, i) {
  state.selectedColor = i
  return state
}

function selectGrid(state, i) {
  state.selectedGrid = i
  return state
}

function setRule(state, x, y, value) {
  let { rules, selectedGrid, selectedEvent, selectedRule } = state
  let rule = rules[selectedGrid][selectedEvent][selectedRule]
  let [ when, then ] = rule
  // WHEN
  let _y = y-5
  if (x < 3) {
    when[_y][x] = value
  }
  // THEN
  if (x > 4) {
    let _x = x-5
    then[_y][_x] = value
  }
  return state
}

function setRuleColor(state, x, y) {
  let { selectedColor } = state
  state = setRule(state, x, y, selectedColor)
  return state
}

function eraseRuleColor(state, x, y) {
  state = setRule(state, x, y, null)
  return state
}

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

// HTML SCAFFOLDING

function renderRuleEditor(state) {
  let rules = [ "ʘ", "˄", "˃", "˅", "˂", "å", "ß", " " ]
  let ruleSelector = rules.map((rule, i) => {
    return h('li',
      h('button', {
        click: () => setEvent(i),
        class: i === state.selectedEvent ? 'selected' : ''
      }, rule)
    )
  })

  let ruleList = state.rules[state.selectedGrid][state.selectedEvent].map((rule, ruleIndex) => {
    let controlButtons = [
      h('button', {}, `˄`),
      h('button', {}, `x`),
      h('button', {}, `˅`)
    ]
    let whenButtons = []
    for (let y = 0; y < 3; y++) {
      let row = []
      for (let x = 0; x < 3; x++) {
        let r = rule[0][x][y]
        if (r === null) r = ''
        row.push(
          h('button', {
            style: `background: ${colors[rule[0][x][y]]}`,
            click: () => {
              if (rule[0][x][y] === state.selectedColor) {
                rule[0][x][y] = null
              } else {
                rule[0][x][y] = state.selectedColor
              }
              renderRuleEditor(state)
            }
          }, r)
        )
      }
      whenButtons.push(h('div', {}, ...row))
    }
    let thenButtons = []
    for (let y = 0; y < 3; y++) {
      let row = []
      for (let x = 0; x < 3; x++) {
        let r = rule[1][x][y]
        if (r === null) r = ''
        row.push(
          h('button', {
            style: `background: ${colors[rule[1][x][y]]}`,
            click: () => {
              if (rule[1][x][y] === state.selectedColor) {
                rule[1][x][y] = null
              } else {
                rule[1][x][y] = state.selectedColor
              }
              renderRuleEditor(state)
            }
          }, r)
        )
      }
      thenButtons.push(h('div', {}, ...row))
    }

    return h('li', { class: 'rule' }, ...[
      // h('div', { class: 'controls' }, ...controlButtons),
      h('div', { class: 'when' }, ...whenButtons),
      h('div', { class: 'then' }, ...thenButtons)
    ])
  })

  let layout = [
    h('ol', { id: 'rule-selector' }, ...ruleSelector),
    h('ol', { id: 'rule-list' }, ...ruleList)
  ]

  r('#rules', layout)
}

function renderTutorial(state) {
  const videos = [
    h('video', {
      src: 'videos/blinky.webm',
      controls: true
    }),
    h('video', {
      src: 'videos/falling.webm',
      controls: true
    }),
    h('video', {
      src: 'videos/movey.webm',
      controls: true
    }),
  ]
  r('#tutorials', videos)
}

function setColor(i) {
  state = selectColor(state, i)
  renderRuleEditor(state)
}

function setEvent(i) {
  state = selectEvent(state, i)
  renderRuleEditor(state)
}

function setCurrentGrid(i) {
  state = selectGrid(state, i)
  renderRuleEditor(state)
}

function togglePlay() {
  state.view = state.view == 'play' ? 'edit' : 'play'
}

function clearGrid() {
  console.log('clear')
  for (let y = 0; y < state.rows; y++) {
    state.grids[state.selectedGrid][y] = []
    for (let x = 0; x < state.columns; x++) {
      state.grids[state.selectedGrid][y][x] = 0
    }
  }
  for (let y = 0; y < state.rows; y++) {
    state.grids[state.selectedGrid][y][0] = 1
    state.grids[state.selectedGrid][y][state.columns-1] = 1
  }
  for (let x = 0; x < state.columns; x++) {
    state.grids[state.selectedGrid][0][x] = 1
    state.grids[state.selectedGrid][state.rows-1][x] = 1
  }
}

// STARTUP

window.addEventListener('load', () => {
  let c = new p5(colorCodeContext, 'color-code-canvas')
  renderRuleEditor(state)
})
