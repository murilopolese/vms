const sys_color = [10, 30]
const colors = [
  '#000',
  '#f00',
  '#ff0',
  '#0f0',
  '#0ff',
  '#00f',
  '#f0f',
  '#fff',
]
let eventNames = ['tick', 'up', 'right', 'down', 'left', 'a', 'b', 'hack']

let state = {
  tileMap: [],
  rules: [],
  cursor: [3, 4],
  selectedColor: 1,
  selectedRule: 0,
  selectedEvent: 0,
  view: 'code',
  columns: 8,
  rows: 8,
  res: 1
}

for (let y = 0; y < 8; y++) {
  state.tileMap[y] = []
  for (let x = 0; x < 8; x++) {
    state.tileMap[y][x] = 0
  }
}
// Draw walls
for (let y = 0; y < 8; y++) {
  state.tileMap[y][0] = 1
  state.tileMap[y][7] = 1
}
for (let x = 0; x < 8; x++) {
  state.tileMap[0][x] = 1
  state.tileMap[7][x] = 1
}
for (let events = 0; events < eventNames.length; events++) {
  state.rules[events] = []
  for (let rules = 0; rules < 16; rules++) {
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
    state.rules[events][rules] = [when, then]
  }
}

function setup() {
  createCanvas(windowHeight*0.5, windowHeight*0.5)
  state.res = width/state.columns
  background(colors[0])
  noStroke()
}

function draw() {
  background(colors[0])
  state = update(state)
  render(state)
}

function render(state) {
  switch (state.view) {
    case 'play':
      renderPlay(state)
      break;
    case 'edit':
      renderEdit(state)
      break;
    case 'code':
      renderCode(state)
      break;
    default:
  }
}

function renderPlay(state) {
  let { tileMap, res } = state
  for (let y = 0; y < tileMap.length; y++) {
    for (let x = 0; x < tileMap[y].length; x++) {
      let value = tileMap[y][x]
      let color = colors[0]
      if (value !== null && value !== '') {
        value = parseInt(value)
        color = colors[value]
      }
      fill(color)
      square(x*res, y*res, res)
    }
  }
}

function renderEdit(state) {
  renderPlay(state)
  drawCursor(state)
}

function renderCode(state) {
  let {
    res, rows, columns,
    rules, selectedEvent, selectedRule
  } = state
  let rule = rules[selectedEvent][selectedRule]
  let [ when, then ] = rule
  // first row is for the events
  for (let x = 0; x < columns; x++) {
    if (selectedEvent === x) {
      fill(colors[3])
    } else {
      fill(colors[4])
    }
    square(x*res, 0, res)
  }
  // the next two lines are for rule slots
  for (let x = 0; x < columns*2; x++) {
    if (selectedRule === x) {
      fill(colors[5])
    } else {
      fill(colors[6])
    }
    square((x%columns)*res, (1+parseInt(x/columns))*res, res)
  }
  // the next line is for the available colors
  for (let x = 0; x < columns; x++) {
    fill(colors[x])
    square(x*res, 3*res, res)
  }
  // breathe line
  fill(sys_color[1])
  for (let x = 0; x < columns; x++) {
    square(x*res, 4*res, res)
  }
  for (let y = 5; y < rows; y++) {
    square(3*res, y*res, res)
    square(4*res, y*res, res)
  }
  // when
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      let value = when[y][x]
      if (value === null || value === '') {
        fill(sys_color[0])
      } else {
        fill(colors[parseInt(value)])
      }
      square(x*res, (5+y)*res, res)
    }
  }
  // then
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      let value = then[y][x]
      if (value === null || value === '') {
        fill(sys_color[0])
      } else {
        fill(colors[parseInt(value)])
      }
      square((5+x)*res, (5+y)*res, res)
    }
  }
  drawCursor(state)
}

function drawCursor(state) {
  let { cursor, res, selectedColor } = state
  let [ x, y ] = cursor
  fill(colors[selectedColor])
  square(x*res, y*res, res)
}

function update(state) {
  if (state.view === 'play') state = applyRules(state, 'tick')
  return Object.assign({}, state)
}

// EVENT HANDLERS

function keyPressed() {
  switch (state.view) {
    case 'play':
      state = handleEventPlay(state, key)
      break;
    case 'edit':
      state = handleEventEdit(state, key)
      break;
    case 'code':
      state = handleEventCode(state, key)
      break;
    default:
  }
}

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
  return Object.assign({}, state)
}

function handleEventEdit(state, key) {
  switch (key) {
    case 'ArrowUp':
      state = moveCursor(state, 'up')
      break;
    case 'ArrowRight':
      state = moveCursor(state, 'right')
      break;
    case 'ArrowDown':
      state = moveCursor(state, 'down')
      break;
    case 'ArrowLeft':
      state = moveCursor(state, 'left')
      break;
    case 'z':
      state = setTileMapColor(state)
      break;
    case 'x':
      state = eraseTileMapColor(state)
      break;
    case 'c':
      state = togglePlayView(state)
      break;
    default:

  }
  return Object.assign({}, state)
}

function handleEventCode(state, key) {
  let { cursor, columns, rows } = state
  let [ x, y ] = cursor
  switch (key) {
    case 'ArrowUp':
      state = moveCursor(state, 'up')
      break;
    case 'ArrowRight':
      state = moveCursor(state, 'right')
      break;
    case 'ArrowDown':
      state = moveCursor(state, 'down')
      break;
    case 'ArrowLeft':
      state = moveCursor(state, 'left')
      break;
    case 'z':
      if (y == 0) state = selectEvent(state, x)
      else if (y > 0 && y < 3) state = selectRule(state, x + (y-1)*columns)
      else if (y === 3) state = selectColor(state, x)
      break;
    case 'x':
      // state = eraseTileMapColor(state)
      break;
    case 'c':
      state = togglePlayView(state)
      break;
    default:

  }
  return Object.assign({}, state)
}

function applyRules(state, eventName) {
  let index = eventNames.indexOf(eventName)
  console.log(eventName)
  return Object.assign({}, state)
}

function moveCursor(state, eventName) {
  let { rows, columns } = state
  switch (eventName) {
    case 'up':
      if (state.cursor[1] === 0) state = toggleEditView(state)
      state.cursor[1] = (rows + state.cursor[1] - 1) % rows
      break;
    case 'right':
      if (state.cursor[0] === columns-1) state = toggleEditView(state)
      state.cursor[0] = (state.cursor[0] + 1) % columns
      break;
    case 'down':
      if (state.cursor[1] === rows-1) state = toggleEditView(state)
      state.cursor[1] = (state.cursor[1] + 1) % rows
      break;
    case 'left':
      if (state.cursor[0] === 0) state = toggleEditView(state)
      state.cursor[0] = (columns + state.cursor[0] - 1) % columns
      break;
    default:

  }
  return Object.assign({}, state)
}

function setTileMapColor(state) {
  let { selectedColor, cursor } = state
  let [ x, y ] = cursor
  state.tileMap[y][x] = selectedColor
  return Object.assign({}, state)
}

function eraseTileMapColor(state) {
  let { cursor } = state
  let [ x, y ] = cursor
  state.tileMap[y][x] = 0
  return Object.assign({}, state)
}

function togglePlayView(state) {
  if (state.view === 'play') state.view = 'edit'
  else if (state.view === 'edit') state.view = 'play'
  else if (state.view === 'code') state.view = 'play'
  return Object.assign({}, state)
}

function toggleEditView(state) {
  if (state.view === 'edit') state.view = 'code'
  else if (state.view === 'code') state.view = 'edit'
  return Object.assign({}, state)
}

function selectEvent(state, i) {
  state.selectedEvent = i
  return Object.assign({}, state)
}

function selectRule(state, i) {
  state.selectedRule = i
  return Object.assign({}, state)
}

function selectColor(state, i) {
  state.selectedColor = i
  return Object.assign({}, state)
}
