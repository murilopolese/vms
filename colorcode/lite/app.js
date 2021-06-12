const n = null
let state = {
  colors: [
    '#1a5fb4',
    '#1c71d8',
    '#3584e4',
    '#62a0ea',
    '#26a269',
    '#2ec27e',
    '#33d17a',
    '#57e389',
    '#e5a50a',
    '#f5c211',
    '#f6d32d',
    '#f8e45c',
    '#a51d2d',
    '#c01c28',
    '#e01b24',
    '#ed333b'
  ],
  rows: 40,
  columns: 40,
  grid: [],
  rules: [

  ]
}

for (let y = 0; y < state.rows; y++) {
  state.grid[y] = []
  for (let x = 0; x < state.columns; x++) {
    // state.grid[y][x] = parseInt(Math.random() * 3)
    // state.grid[y][x] = (x + y) % 16
    // state.grid[y][x] = parseInt(Math.hypot( x-(state.rows/2), y-(state.columns/2) )) % 16
    // state.grid[y][x] = parseInt(2*Math.hypot( x-(state.rows/2), y-(state.columns/2) )) % 16
    // state.grid[y][x] = parseInt((2+Math.sin((x+y)/Math.PI))*Math.hypot( x-(state.rows/2), y-(state.columns/2) )) % 16
    state.grid[y][x] = 0
  }
}

// FRAMEWORK
function h (tag, attrs, ...children) {
	const el = document.createElement(tag)
	if (typeof attrs === 'object') {
		for (let k in attrs) {
			if (typeof attrs[k] === 'function') el.addEventListener(k, attrs[k])
			else el.setAttribute(k, attrs[k])
		}
	} else if (attrs) {
		children = [attrs].concat(children)
	}
	for (let child of children) el.append(child)
	return el
}

function render(query, el) {
	let target = document.querySelector(query)
	target.innerHTML = ''
	if (el instanceof Array) {
		for (e in el) {
			target.appendChild(el[e])
		}
	} else {
		target.appendChild(el)
	}
}

window.onload = main

function main() {
  // setInterval(() => {
  //   state.grid = applyRules(state.grid, state.rules)
  //   render('body', Layout(state))
  // }, 1000/12)
  render('body', Layout(state))
}

function Row(row, y) {
  return h('div', { class: 'row' },
    ...row.map((cell, x) => Cell(cell, x, y))
  )
}

function Cell(cell, x, y) {
  return h('div', {
    class: 'cell',
    style: `background: ${state.colors[cell]}`,
    click: () => {
      state.grid[y][x] += 1
      state.grid[y][x] %= 16
      render('body', Layout(state))
    }
  }, cell.toString(16))
}

function Layout(state) {
  return h('div', { id: 'display' },
    ...state.grid.map((row, y) => Row(row, y))
  )
}
