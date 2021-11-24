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

let state = {
  tileMap: [],
  rules: [],
  cursor: [3, 5],
  selectedColor: 2,
  selectedRule: 0,
  selectedEvent: 0,
  view: 'edit',
  columns: 16,
  rows: 16
}
let stories = []

for (let y = 0; y < state.rows; y++) {
  state.tileMap[y] = []
  for (let x = 0; x < state.columns; x++) {
    state.tileMap[y][x] = 0
  }
}
// Draw walls
for (let y = 0; y < state.rows; y++) {
  state.tileMap[y][0] = 1
  state.tileMap[y][state.columns-1] = 1
}
for (let x = 0; x < state.columns; x++) {
  state.tileMap[0][x] = 1
  state.tileMap[state.rows-1][x] = 1
}
for (let events = 0; events < eventNames.length; events++) {
  state.rules[events] = []
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
    state.rules[events][rules] = [when, then]
  }
}

let storiesIndex = [
  "animationfinn",
  "animationmonster",
  "breakout",
  "fluidsimulation",
  "protopacman",
  "shootkaboom",
  "wireworld",
  "fallcolors",
  "rogue",
  "stairs",
  "pixelinvader",
  "snake",
  "boulder",
  "trampoline",
  "fireinthesky",
  "rainbow",
  "pong2",
  "duel",
  "burningfractal",
  "tangledforest",
  "rollingpixel",
  "spring",
  "hilbert_brains",
  "waves",
  "bomber",
]

let keysPressed = []

// P5JS stuff

function preload() {
  for (let i = 0; i < storiesIndex.length; i++) {
    stories.push(
      loadJSON(`stories/${storiesIndex[i]}.json`)
    )
  }
}

function setup() {
  elements.screen = document.querySelector('#canvas')
  let rem = windowWidth/100
  canvas = createCanvas(40*rem, 40*rem)
  canvas.parent(elements.screen)
  angleMode(DEGREES)
  res = (canvas.width/state.columns)
  background(colors[0])
  renderRuleEditor(state)
  renderStories(state)
  renderTutorial(state)
}

function draw() {
  res = (canvas.width/state.columns)
  background(colors[0])
  if (window.location.hash.indexOf('#story-') === 0) {
    let i = parseInt(window.location.hash.split('-')[1])
    state = Object.assign({}, stories[i])
    window.location.hash = ''
    renderRuleEditor(state)
  }
  state = update(state)
  render(state)
}

function render(state) {
  renderPlay(state)
}

function renderPlay(state) {
  let { tileMap } = state
  for (let y = 0; y < tileMap.length; y++) {
    for (let x = 0; x < tileMap[y].length; x++) {
      let value = tileMap[y][x]
      let color = colors[0]
      if (value !== null && value !== '') {
        value = parseInt(value)
        color = colors[value]
      }
      fill(color)
      stroke(color)
      square(x*res, y*res, res)
    }
  }
}

function update(state) {
  let x = map(mouseX, 0, width, 0, state.columns)
  let y = map(mouseY, 0, height, 0, state.rows)
  state.cursor = [ parseInt(x), parseInt(y) ]
  if (state.view === 'play' && frameCount % 5 == 0) {
    state = applyRules(state, 'tick')
  }
  return state
}

function keyPressed(e) {
  if (typeof e === 'string') {
    key = e
  } else {
    e.preventDefault()
  }
  if (Number.isFinite(parseInt(key))) {
    state.selectedColor = parseInt(key)
  }
  if (state.view === 'play') {
    state = handleEventPlay(state, key)
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
    state = setTileMapColor(state)
  }
}

function mouseDragged() {
  if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
    state = setTileMapColor(state)
  }
}

function windowResized() {
  let rem = windowWidth/100
  resizeCanvas(40*rem, 40*rem);
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
  let { tileMap, rules, rows, columns } = state
  let index = eventNames.indexOf(eventName)
  let eventRules = rules[index]
  let stepTiles = copyArray(tileMap)
  for (let y = 1; y < rows-1; y++) {
    for (let x = 1; x < columns-1; x++) {
      // For each cell, check neighborhood
      let cell = tileMap[y][x]
      for (let i = 0; i < eventRules.length; i++) {
        let rule = eventRules[i]
        let [when, then] = rule
        // Check if the center of 'when' matches current cell
        if (when[1][1] === cell) {
          let startX = x-1
          let endX = x+2
          let aroundCell = [
            tileMap[               max(y-1, 0)].slice(startX, endX),
            tileMap[                        y ].slice(startX, endX),
            tileMap[min(y+1, tileMap.length)].slice(startX, endX)
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
  state.tileMap = stepTiles
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
  let { selectedColor, cursor } = state
  let [ x, y ] = cursor
  state.tileMap[y][x] = selectedColor
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

function setRule(state, x, y, value) {
  let { rules, selectedEvent, selectedRule } = state
  let rule = rules[selectedEvent][selectedRule]
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

  let ruleList = state.rules[state.selectedEvent].map((rule, ruleIndex) => {
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
function renderStories(state) {
  let gallery = storiesIndex.map((name, i) => {
    return h('a', { class: 'story', href: `#story-${i}`},
      h('img', { src: `stories/${name}.png`, alt: name })
    )
  })
  r('#stories', gallery)
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
function togglePlay() {
  state.view = state.view == 'play' ? 'edit' : 'play'
}

function clearGrid() {
  console.log('clear')
  for (let y = 0; y < state.rows; y++) {
    state.tileMap[y] = []
    for (let x = 0; x < state.columns; x++) {
      state.tileMap[y][x] = 0
    }
  }
  for (let y = 0; y < state.rows; y++) {
    state.tileMap[y][0] = 1
    state.tileMap[y][state.columns-1] = 1
  }
  for (let x = 0; x < state.columns; x++) {
    state.tileMap[0][x] = 1
    state.tileMap[state.rows-1][x] = 1
  }
}
