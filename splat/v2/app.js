const choo = require('choo')
const html = require('choo/html')
const Component = require('choo/component')

let {
  Rule,
  Element,
  grid,
  elements,
  clearGrid
} = require('./splat.js')

const colors = [
  '#000000', '#222034', '#45283c', '#663931', '#8f563b', '#df7126',
  '#d9a066', '#eec39a', '#fbf236', '#99e550', '#6abe30', '#37946e',
  '#4b692f', '#524b24', '#323c39', '#3f3f74', '#306082', '#5b6ee1',
  // '#639bff', '#5fcde4', '#cbdbfc', '#ffffff', '#9badb7', '#847e87',
  '#696a6a', '#595652', '#76428a', '#ac3232', '#d95763', '#d77bba',
  '#8f974a', '#8a6f30'
]

const app = choo()

app.use(store)

app.route('/', Layout)

app.mount('#app')

function store(state, emitter) {
  state.elementsDict = elements
  state.elements = Object.values(elements)
  state.grid = grid.slice()
  state.grid[5][5] = elements['X']
  state.editingElement = 'A'
  state.stampingGrid = 'A'
  state.stampingRule = '@'
  state.interval = 0

  console.log('initialState', state)

  emitter.on('selectEditingElement', function(symbol) {
    state.editingElement = symbol
    emitter.emit('render')
  })

  emitter.on('selectStampingGrid', function(symbol) {
    state.stampingGrid = symbol
    emitter.emit('render')
  })

  emitter.on('selectStampingRule', function(symbol) {
    state.stampingRule = symbol
    emitter.emit('render')
  })

  emitter.on('addRule', function() {
    let index = state.elements.findIndex(e => e.name === state.editingElement)
    state.elements[index].rules.push(new Rule({}))
    emitter.emit('render')
  })

  emitter.on('stampGrid', function(x, y) {
    console.log('stamp grid')
    let element = state.elements.find(el => el.name === state.stampingGrid)
    state.grid[y][x] = element
    emitter.emit('render')
  })

  emitter.on('stampRule', function(type, i, x, y) {
    console.log('stampRule')
    let index = state.elements.findIndex(e => e.name === state.editingElement)
    state.elements[index].rules[i][type][y][x] = state.stampingRule
    emitter.emit('render')
  })

  emitter.on('applyRules', function() {
    for (let i = 0; i < 100; i++) {
      let x = 1 + parseInt(Math.random() * 28)
      let y = 1 + parseInt(Math.random() * 28)
      let element = state.grid[y][x]
      for (let j = 0; j < element.rules.length; j++) {
        let rule = element.rules[j]
        let matched = rule.match(state.grid, x, y)
        if (matched) {
          state.grid = rule.apply(state.grid, x, y)
          break
        }
      }
    }
    // emitter.emit('render')
    state.cache(Canvas, 'canvas').render(state, emitter.emit)
  })

  emitter.on('play', function() {
    state.interval = setInterval(() => {
      emitter.emit('applyRules')
    }, 10)
  })

  emitter.on('stop', function() {
    clearInterval(state.interval)
  })

  emitter.emit('play')

}

function Layout(state, emit) {
  return html`
    <div id="app">
      ${Grid(state, emit)}
      ${Editor(state, emit)}
    </div>
  `
}

function Grid(state, emit) {
  function ElementPicker() {
    return state.elements.map((el, i) => {
      let selectedClass = el.name === state.stampingGrid ? 'selected' : ''
      let onclick = () => emit('selectStampingGrid', el.name)
      return html`
        <button
          style="background: ${colors[i%colors.length]}"
          class=${selectedClass}
          onclick=${onclick}
          >
          ${el.name}
        </button>
      `
    })
  }
  function ButtonStage() {
    let buttons = []
    for (let y = 0; y < 30; y++) {
      for (let x = 0; x < 30; x++) {
        let el = state.grid[y][x]
        let i = state.elements.findIndex(e => e.name === el.name)
        let onclick = () => emit('stampGrid', x, y)
        buttons.push(html`
          <button
            style="background: ${colors[i%colors.length]}"
            onclick=${onclick}
            >
          ${el.name}
          </button>
        `)
      }
    }
    return buttons
  }
  function CanvasStage() {
    return state.cache(Canvas, 'canvas').render(state, emit)
  }
  return html`
  <div id="grid">
    <div class="element-picker">
      ${ElementPicker()}
    </div>
    <div class="grid">
      ${CanvasStage()}
    </div>
  </div>
  `
}

function Editor(state, emit) {
  function ElementList() {
    return state.elements.map((el) => {
      let selectedClass = el.name === state.editingElement ? 'selected' : ''
      let onclick = () => emit('selectEditingElement', el.name)
      return html`
        <button
          class=${selectedClass}
          onclick=${onclick}
          >
          ${el.name}
        </button>
      `
    })
  }
  function ElementPicker() {
    let symbols = ['@', '.', '?', '_']

    return [
      symbols.map((symbol) => {
        let selectedClass = symbol === state.stampingRule ? 'selected' : ''
        let onclick = () => emit('selectStampingRule', symbol)
        return html`
          <button
            class=${selectedClass}
            onclick=${onclick}
            >
            ${symbol}
          </button>`
      }),
      state.elements.map((el) => {
        let selectedClass = el.name === state.stampingRule ? 'selected' : ''
        let onclick = () => emit('selectStampingRule', el.name)
        return html`
          <button
            class=${selectedClass}
            onclick=${onclick}
            >
            ${el.name}
          </button>`
      })
    ]
  }
  function Rule({ when, then }, i) {
    return html`
      <div class="rule">
        <div class="when">
          ${when.map((row, y) => {
            return html`
              <div>
                ${row.map((symbol, x) => {
                  let onclick = () => emit('stampRule', 'when', i, x, y)
                  return html`
                    <button onclick=${onclick}>${symbol}</button>
                  `
                })}
              </div>
            `
          })}
        </div>
        <div> ${`=>`} </div>
        <div class="then">
          ${then.map((row, y) => {
            return html`
              <div>
                ${row.map((symbol, x) => {
                  let onclick = () => emit('stampRule', 'then', i, x, y)
                  return html`
                    <button onclick=${onclick}>${symbol}</button>
                  `
                })}
              </div>
            `
          })}
        </div>
      </div>
    `
  }
  let elementIndex = state.elements.findIndex(el => el.name === state.editingElement)
  return html`
    <div id="editor">
      <div class="element-list">
        ${ElementList()}
      </div>
      <div class="rules">
        ${state.elements[elementIndex].rules.map(Rule)}
        <button class="add-rule" onclick=${() => emit('addRule')}>+</button>
      </div>
      <div class="element-picker">
        ${ElementPicker()}
      </div>
    </div>
  `
}

class Canvas extends Component {
  constructor(id, state, emit) {
    super(id)
    this.n = 30
    this.size = 800
    this.res = this.size/this.n
    this.cursor = { x: 0, y: 0 }
  }

  update(state) {
    let context = this.element.getContext('2d')
    context.clearRect(0, 0, this.element.width, this.element.height)
    context.fillStyle = '#000000'
    let hoveringX = parseInt(
      map(this.cursor.x, 0, this.size, 0, this.n)
    )
    let hoveringY = parseInt(
      map(this.cursor.y, 0, this.size, 0, this.n)
    )
    for (let y = 0; y < this.n; y++) {
      for (let x = 0; x < this.n; x++) {
        if (hoveringX === x && hoveringY === y) {
          context.fillStyle = '#000000'
          context.fillRect(
            x*this.res,
            y*this.res,
            this.res,
            this.res
          )
          context.fillStyle = '#FFFFFF'
          context.fillText(
            state.grid[y][x].name,
            (this.res/4) + x*this.res,
            (this.res/4) + y*this.res
          )
        } else {
          let el = state.grid[y][x]
          let index = state.elements.findIndex(e => e.name === el.name)
          if (index === -1) {
            context.fillStyle = '#FFF'
          } else {
            context.fillStyle = colors[index]
          }

          context.fillRect(
            x*this.res,
            y*this.res,
            this.res,
            this.res
          )
          context.fillStyle = '#FFF'
          context.fillText(
            state.grid[y][x].name,
            (this.res/4) + x*this.res,
            (this.res/4) + y*this.res
          )
        }
      }
    }
    return false // never/don't upate DOM
  }

  createElement(state, emit) {
    let canvas = html`<canvas width=${this.size} height=${this.size}></canvas>`
    let context = canvas.getContext('2d')
    context.font = `${this.res}px monospace`;
    context.textAlign = 'left';
    context.textBaseline = "hanging";
    context.clearRect(0, 0, canvas.width, canvas.height)

    canvas.addEventListener('mousemove', (e) => {
      let layerX = e.layerX
      let layerY = e.layerY
      let canvasOriginalWidth = canvas.width
      let canvasOriginalHeight = canvas.height
      let canvasBounds = canvas.getBoundingClientRect()

      let relativeX = map(layerX, 0, canvasBounds.width, 0, canvasOriginalWidth)
      let relativeY = map(layerY, 0, canvasBounds.height, 0, canvasOriginalHeight)
      this.cursor = { x: relativeX, y: relativeY }
    })
    canvas.addEventListener('mousedown', (e) => {
      console.log(e, this.cursor)
      let hoveringX = parseInt(
        map(this.cursor.x, 0, this.size, 0, this.n)
      )
      let hoveringY = parseInt(
        map(this.cursor.y, 0, this.size, 0, this.n)
      )
      emit('stampGrid', hoveringX, hoveringY)
    })

    for (let y = 0; y < this.n; y++) {
      for (let x = 0; x < this.n; x++) {
        context.fillText(
          state.grid[y][x].name,
          (this.res/4) + x*this.res,
          (this.res/4) + y*this.res
        )
      }
    }
    return canvas
  }
}

function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
