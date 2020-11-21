const emitter = new EventTarget()

let state = {
  elements: elements,
  grid: grid,
  interval: 0,
  playing: false,
  selectedElement: 'e',
  editingElement: 'e',
}

on(emitter, 'render', function(e) {
  render('#app', Layout(e.detail))
})
on(emitter, 'updateGrid', function(e) {
  let state = e.detail
  render('#grid', state.grid.map(Row))
})

on(emitter, 'applyRules', function(e) {
  let [ x, y ] = e.detail
  let element = state.grid[y][x]
  for (let i = 0; i < element.rules.length; i++) {
    let rule = element.rules[i]
    let matched = rule.match(state.grid, x, y)
    if (matched) {
      state.grid = rule.apply(state.grid, x, y)
      break
    }
  }
  emit(emitter, 'updateGrid', state)
})
on(emitter, 'selectElement', function(e) {
  state.selectedElement = e.detail
  emit(emitter, 'render', state)
})
on(emitter, 'editElement', function(e) {
  console.log('edit element', e.detail)
  state.editingElement = e.detail
  emit(emitter, 'render', state)
})
on(emitter, 'setElement', function(e) {
  let [ x, y ] = e.detail
  state.grid[y][x] = state.elements[state.selectedElement]
  emit(emitter, 'render', state)
})
on(emitter, 'setRule', function(e) {
  let { index, type, x, y } = e.detail
  let element = state.elements[state.editingElement]
  let rule = element.rules[index]
  rule[type][y][x] = state.selectedElement
  emit(emitter, 'render', state)
})
on(emitter, 'addRule', function(e) {
  state.elements[state.editingElement].rules.push(new Rule({}))
  emit(emitter, 'render', state)
})

on(emitter, 'setBomb', () => {
  state.grid = setBomb(state.grid)
  emit(emitter, 'render', state)
})
on(emitter, 'setSwapLine', () => {
  state.grid = setSwapLine(state.grid)
  emit(emitter, 'render', state)
})
on(emitter, 'setFalling', () => {
  state.grid = setFalling(state.grid)
  emit(emitter, 'render', state)
})
on(emitter, 'setZombie', () => {
  state.grid = setZombie(state.grid)
  emit(emitter, 'render', state)
})
on(emitter, 'setYolo', () => {
  state.grid = setYolo(state.grid)
  emit(emitter, 'render', state)
})
on(emitter, 'play', () => {
  state.playing = true
  clearInterval(state.interval)
  state.interval = setInterval(() => {
    emit(
      emitter,
      'applyRules',
      [
        1 + parseInt(Math.random()*(GRID_HEIGHT-2)),
        1 + parseInt(Math.random()*(GRID_WIDTH-2))
      ]
    )
  }, 1)
  emit(emitter, 'render', state)
})
on(emitter, 'stop', () => {
  state.playing = false
  clearInterval(state.interval)
  emit(emitter, 'render', state)
})

function Layout(state) {
  let selectedElement = state.elements[state.selectedElement]
  let editingElement = state.elements[state.editingElement]

  let gridEl = h(
    'div', { id: 'grid', class: 'grid' },
    ...state.grid.map(Row)
  )
  let examples = h(
    'div', { class: 'examples' },
    h('button', { click: () => emit(emitter, 'setBomb') }, 'bomb'),
    h('button', { click: () => emit(emitter, 'setSwapLine') }, 'swap line'),
    h('button', { click: () => emit(emitter, 'setFalling') }, 'falling'),
    h('button', { click: () => emit(emitter, 'setZombie') }, 'zombie'),
    h('button', { click: () => emit(emitter, 'setYolo') }, 'yolo')
  )
  let controls = h(
    'div', { class: 'controls' },
    h('button', {
      click: () => emit(emitter, 'play'),
      style: `font-weight:${state.playing?'bold':'normal'}`
    }, 'play'),
    h('button', {
      click: () => emit(emitter, 'stop'),
      style: `font-weight:${!state.playing?'bold':'normal'}`
    }, 'stop'),
  )

  function EditButton(i, type, symbol, x, y) {
    return h(
      'button',
      {
        click: () => {
          emit(emitter, 'setRule', {
            index: i,
            type: type,
            symbol: symbol,
            x: x,
            y: y
          })
        }
      },
      symbol ? symbol : '.'
    )
  }
  let editor = h(
    'div', { class: 'editor' },
    h('p', {}, `editing: ${editingElement.name}`),
    ...Object.values(state.elements).map(
      el => h(
        'button',
        { click: () => emit(emitter, 'editElement', el.name[0])},
        el.name[0]
      )
    ),
    h('h3', {}, editingElement.name),
    h(
      'div', { class: 'rules' },
      ...editingElement.rules.map((rule, ri) => {
        return h(
          'div', { class: 'rule' },
          h('h4', {}, `Rule ${ri+1}`),
          h(
            'div', { class: 'rule-pair' },
            h(
              'div', { class: 'column' },
              h('div', {},
                ...rule.when[0].map((r, i) => EditButton(ri, 'when', r, i, 0))
              ),
              h('div', {},
                ...rule.when[1].map((r, i) => EditButton(ri, 'when', r, i, 1))
              ),
              h('div', {},
                ...rule.when[2].map((r, i) => EditButton(ri, 'when', r, i, 2))
              ),
            ),
            h('div', { class: 'column' }, '=>'),
            h(
              'div', { class: 'column' },
              h('div', {},
                ...rule.then[0].map((r, i) => EditButton(ri, 'then', r, i, 0))
              ),
              h('div', {},
                ...rule.then[1].map((r, i) => EditButton(ri, 'then', r, i, 1))
              ),
              h('div', {},
                ...rule.then[2].map((r, i) => EditButton(ri, 'then', r, i, 2))
              ),
            )
          )
        )
      }),
    ),
    h('button', { click: () => emit(emitter, 'addRule')}, 'ADD RULE')
  )

  return h(
    'div', { class: 'layout' },
    h('h1', {}, 'Spatial Programming Language ASCII Text'),
    h(
      'div', { class: 'row' },
      h(
        'div', {},
        h('h2', {}, 'Controls:'),
        controls,
        gridEl,
      ),
      h(
        'div', {},
        h('h2', {}, 'Palette:'),
        h('p', {}, `selected: ${selectedElement.name}`),
        ...Object.values(state.elements).map(
          el => h(
            'button',
            { click: () => emit(emitter, 'selectElement', el.name[0])},
            el.name[0]
          )
        ),
        h('h2', {}, 'Editor:'),
        editor,
      ),
    )
    // h('h2', {}, 'Examples:'),
    // examples,
  )
}

function Row(els, index) {
  function handleClick(args) {
    // console.log('apply rules on', args)
    if (!state.playing) {
      emit(emitter, 'setElement', args)
    }
  }
  return h(
    'div', { class: 'row' },
    ...els.map((el, i) => {
      let style = `color: white; background: ${el.color}`
      if (el.color === 'white') {
        style = `color: #eee; background: ${el.color}`
      }
      let props = {
        click: () => handleClick([i, index]),
        style: style
      }
      if (i === 0) props.disabled = 'disabled'
      if (i === GRID_HEIGHT-1) props.disabled = 'disabled'
      if (index === 0) props.disabled = 'disabled'
      if (index === GRID_WIDTH-1) props.disabled = 'disabled'
      return h(
        'button',
        props,
        el.name[0]
      )
    })
  )
}

function setSwapLine(grid) {
  grid = clearGrid()
  for (let i = 0; i < 9; i++) {
    grid[i+2][3] = state.elements['s']
  }
  grid[7][8] = state.elements['r']
  grid[7][9] = state.elements['r']
  grid[8][7] = state.elements['r']
  grid[8][8] = state.elements['r']
  grid[10][10] = state.elements['y']
  return grid
}

function setBomb(grid) {
  grid = clearGrid()
  grid[5][5] = state.elements['b']
  return grid
}

function setFalling(grid) {
  grid = clearGrid()
  grid[1][3] = state.elements['f']
  grid[1][4] = state.elements['f']
  grid[1][6] = state.elements['f']
  grid[1][7] = state.elements['f']
  grid[1][8] = state.elements['f']
  grid[1][10] = state.elements['f']
  return grid
}

function setZombie(grid) {
  grid = clearGrid()
  grid[7][7] = state.elements['z']
  grid[7][8] = state.elements['r']
  grid[7][9] = state.elements['r']
  grid[6][8] = state.elements['r']
  grid[8][8] = state.elements['r']
  grid[10][10] = state.elements['y']
  return grid
}

function setYolo(grid) {
  grid = clearGrid()
  for (let i = 0; i < 50; i++) {
    grid[1+parseInt(Math.random()*(GRID_HEIGHT-2))][1+parseInt(Math.random()*(GRID_WIDTH-2))] = state.elements['y']
  }
  return grid
}

window.onload = function() {
  emit(emitter, 'render', state)
}
