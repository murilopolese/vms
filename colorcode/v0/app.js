let state = {
  interval: null,
  operators: ['and', 'or', 'xor'],
  rules: [],
  cells: [],
  weave: []
}

function random(a, b) {
  return parseInt(a + (Math.random() * (b - a)))
}

for (let i = 0; i < 16; i++) {
  state.rules.push(random(0, 3))
  state.cells.push(random(0, 2))
}
state.cells[0] = 1

let operators = [
  function and(a, b) {
    return a & b
  },

  function or(a, b) {
    return a | b
  },

  function xor(a, b) {
    return a ^ b
  }
]

on('render', ([state]) => {
  render('#content', [
    renderRules(state, emit),
    renderCells(state, emit)
  ])
  render('#weave', renderWeave(state, emit))
})

on('increment-rule', ([i]) => {
  state.rules[i] = (state.rules[i] + 1) % state.operators.length
  emit('render', state)
})

on('increment-cell', ([i]) => {
  state.cells[i] = (state.cells[i] + 1) % 2
  emit('render', state)
})

on('tick', (e) => {
  let newTape = state.cells.slice()
  for (let index in state.rules) {
    let i = parseInt(index || 0)
    let rule = operators[state.rules[i]]
    if (i === 0) {
      newTape[i] = rule(0, state.cells[i+1])
    } else if (i === state.rules.length-1) {
      newTape[i] = rule(state.cells[i-1], 0)
    } else {
      newTape[i] = rule(state.cells[i-1], state.cells[i+1])
    }
  }
  state.weave.push(newTape)
  state.cells = newTape
  emit('render', state)
})

on('toggle', () => {
  if (state.interval == null) {
    emit('tick')
    state.interval = setInterval(function() {
      emit('tick')
    }, 150)
  } else {
    clearInterval(state.interval)
    state.interval = null
    emit('render', state)
  }
})

function renderRules(state, emit) {
  let rules = []
  for (let i in state.rules) {
    let value = state.rules[i]
    let onClick = function(e) {
      if (state.interval === null) emit('increment-rule', i)
    }
    rules.push(
      h('div', { class: 'rule', state: value, click: onClick })
    )
  }
  return h('div', { id: 'rules'}, ...rules)
}

function renderCells(state, emit) {
  let cells = []
  for (let i in state.cells) {
    let value = state.cells[i]
    let onClick = function(e) {
      if (state.interval === null) emit('increment-cell', i)
    }
    cells.push(
      h('div', { class: 'cell', state: value, click: onClick })
    )
  }
  return h('div', { id: 'tape' }, ...cells)
}

function renderControls(state, emit) {
  return h('div', { id: 'controls' },
    h('div', { class: 'button', click: () => emit('tick') }),
    h('div', { class: 'button', click: () => emit('toggle') }),
    h('div', { class: 'button', click: () => window.location.reload() })
  )
}

function renderWeave(state, emit) {
  let rows = []
  for (let i = state.weave.length-1; i >= 0; i--) {
    let row = state.weave[i]
    rows.push(
      h('div', { class: 'row' },
        ...row.map((value) => h('div', { class: 'cell', state: value }))
      )
    )
  }
  return rows
}

render('#controls', renderControls(state, emit))
emit('render', state)
