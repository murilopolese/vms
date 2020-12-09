let {
  Rule,
  Element,
  grid,
  elements,
  clearGrid,
  symmetryMap
} = require('./splat.js')
const Canvas = require('./components/canvas.js')

function store(state, emitter) {
  state.elementsDict = elements
  state.elements = Object.values(elements)
  state.grid = grid.map(r => r.slice())
  state.grid[5][5] = elements['A']
  state.editingElement = 'A'
  state.stampingGrid = 'A'
  state.stampingRule = '@'
  state.interval = 0
  state.playing = false

  console.log('initialState', state)

  emitter.on('selectEditingElement', function(symbol) {
    console.log('select stamping element')
    state.editingElement = symbol
    emitter.emit('render')
  })

  emitter.on('selectStampingGrid', function(symbol) {
    console.log('select stamping grid')
    state.stampingGrid = symbol
    emitter.emit('render')
  })

  emitter.on('selectStampingRule', function(symbol) {
    console.log('select stamping rule')
    state.stampingRule = symbol
    emitter.emit('render')
  })

  emitter.on('addRule', function() {
    console.log('new rule')
    let index = state.elements.findIndex(e => e.name === state.editingElement)
    state.elements[index].rules.push(new Rule({}))
    emitter.emit('render')
  })

  emitter.on('stampGrid', function(x, y) {
    console.log('stamp grid', x, y)
    let element = state.elements.find(el => el.name === state.stampingGrid)
    state.grid[y][x] = element
    emitter.emit('render')
  })

  emitter.on('stampRule', function(type, i, x, y) {
    console.log('stamp rule', type, i, x, y)
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
  })

  emitter.on('resetGrid', function() {
    console.log('reset grid')
    state.grid = state.grid = grid.map(r => r.slice())
  })

  emitter.on('play', function() {
    console.log('play')
    state.playing = true
  })

  emitter.on('stop', function() {
    console.log('stop')
    state.playing = false
  })

  emitter.on('moveRuleUp', function(elementIndex, ruleIndex) {
    let rules = state.elements[elementIndex].rules
    if (ruleIndex > 0) {
      let swap = rules[ruleIndex]
      rules[ruleIndex] = rules[ruleIndex-1]
      rules[ruleIndex-1] = swap
    }
    state.elements[elementIndex].rules = rules
    emitter.emit('render')
  })

  emitter.on('moveRuleDown', function(elementIndex, ruleIndex) {
    let rules = state.elements[elementIndex].rules
    if (ruleIndex < rules.length-1) {
      let swap = rules[ruleIndex]
      rules[ruleIndex] = rules[ruleIndex+1]
      rules[ruleIndex+1] = swap
    }
    state.elements[elementIndex].rules = rules
    emitter.emit('render')
  })

  emitter.on('nextSymmetry', function(elementIndex, ruleIndex, symmetry) {
    let nextSymmetry = (symmetry + 1) % 4
    state.elements[elementIndex].rules[ruleIndex].symmetry = nextSymmetry
    emitter.emit('render')
  })

  state.interval = setInterval(() => {
    if (state.playing) {
      emitter.emit('applyRules')
    }
    state.cache(Canvas, 'canvas').render(state, emitter.emit)
  }, 25)

}

module.exports = store
