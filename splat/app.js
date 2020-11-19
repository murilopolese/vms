const emitter = new EventTarget()
let interval = 0
let playing = false

on(emitter, 'render', function() {
  render('#app', Layout(grid))
})

on(emitter, 'applyRules', function(e) {
  let [ x, y ] = e.detail
  let element = grid[y][x]
  for (let i = 0; i < element.rules.length; i++) {
    let rule = element.rules[i]
    let matched = rule.match(grid, x, y)
    if (matched) {
      grid = rule.apply(grid, x, y)
      break
    }
  }
  emit(emitter, 'render')
})

on(emitter, 'setBomb', () => {
  grid = setBomb(grid)
  emit(emitter, 'render')
})
on(emitter, 'setSwapLine', () => {
  grid = setSwapLine(grid)
  emit(emitter, 'render')
})
on(emitter, 'setFalling', () => {
  grid = setFalling(grid)
  emit(emitter, 'render')
})
on(emitter, 'setZombie', () => {
  grid = setZombie(grid)
  emit(emitter, 'render')
})
on(emitter, 'setYolo', () => {
  grid = setYolo(grid)
  emit(emitter, 'render')
})
on(emitter, 'play', () => {
  playing = true
  clearInterval(interval)
  interval = setInterval(() => {
    emit(
      emitter,
      'applyRules',
      [
        1 + parseInt(Math.random()*(GRID_SIZE-2)),
        1 + parseInt(Math.random()*(GRID_SIZE-2))
      ]
    )
  }, 100)
  emit(emitter, 'render')
})
on(emitter, 'stop', () => {
  playing = false
  clearInterval(interval)
  emit(emitter, 'render')
})

function Layout(state) {
  let rows = h(
    'div', { class: 'grid' },
    ...state.map((row, i) => Row(row, i))
  )
  let buttons = h(
    'div', { class: 'buttons' },
    h('h2', {}, 'Examples:'),
    h('button', { click: () => emit(emitter, 'setBomb') }, 'bomb'),
    h('button', { click: () => emit(emitter, 'setSwapLine') }, 'swap line'),
    h('button', { click: () => emit(emitter, 'setFalling') }, 'falling'),
    h('button', { click: () => emit(emitter, 'setZombie') }, 'zombie'),
    h('button', { click: () => emit(emitter, 'setYolo') }, 'yolo')
  )

  return h(
    'div', { class: 'layout' },
    h('h1', {}, 'Spatial Programming Language ASCII Text'),
    rows,
    // controls,
    buttons
  )
}

function Row(els, index) {
  function handleClick(args) {
    // console.log('apply rules on', args)
    emit(emitter, 'applyRules', args)
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
      if (i === GRID_SIZE-1) props.disabled = 'disabled'
      if (index === 0) props.disabled = 'disabled'
      if (index === GRID_SIZE-1) props.disabled = 'disabled'
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
    grid[i+2][3] = elements['s']
  }
  grid[7][8] = elements['r']
  grid[7][9] = elements['r']
  grid[8][7] = elements['r']
  grid[8][8] = elements['r']
  grid[10][10] = elements['y']
  return grid
}

function setBomb(grid) {
  grid = clearGrid()
  grid[5][5] = elements['b']
  return grid
}

function setFalling(grid) {
  grid = clearGrid()
  grid[1][3] = elements['f']
  grid[1][4] = elements['f']
  grid[1][6] = elements['f']
  grid[1][7] = elements['f']
  grid[1][8] = elements['f']
  grid[1][10] = elements['f']
  return grid
}

function setZombie(grid) {
  grid = clearGrid()
  grid[7][7] = elements['z']
  grid[7][8] = elements['r']
  grid[7][9] = elements['r']
  grid[6][8] = elements['r']
  grid[8][8] = elements['r']
  grid[10][10] = elements['y']
  return grid
}

function setYolo(grid) {
  grid = clearGrid()
  for (let i = 0; i < 50; i++) {
    grid[1+parseInt(Math.random()*(GRID_SIZE-2))][1+parseInt(Math.random()*(GRID_SIZE-2))] = elements['y']
  }
  return grid
}

window.onload = function() {
  emit(emitter, 'render')


}
