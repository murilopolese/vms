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
  dragging: false,
  rules: [

    [ // Rule
      [ // When
        [n, n, n],
        [n, 1, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 0, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 2, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 1, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 3, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 2, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 4, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 3, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 5, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 4, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 6, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 5, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 7, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 6, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 8, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 7, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 9, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 8, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 10, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 9, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 11, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 10, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 12, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 11, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 13, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 12, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 14, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 13, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 15, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 14, n],
        [n, n, n]
      ],
    ],
    [ // Rule
      [ // When
        [n, n, n],
        [n, 0, n],
        [n, n, n]
      ],
      [ // Then
        [n, n, n],
        [n, 15, n],
        [n, n, n]
      ],
    ],


    // [ // Rule
    //   [ // When
    //     [n, n, n],
    //     [n, 1, n],
    //     [n, 0, n]
    //   ],
    //   [ // Then
    //     [n, n, n],
    //     [n, 0, n],
    //     [n, 1, n]
    //   ],
    // ],
    // [ // Rule
    //   [ // When
    //     [n, n, n],
    //     [n, 1, n],
    //     [0, 1, 1]
    //   ],
    //   [ // Then
    //     [n, n, n],
    //     [n, 0, n],
    //     [1, 1, n]
    //   ],
    // ],
    // [ // Rule
    //   [ // When
    //     [n, n, n],
    //     [n, 1, n],
    //     [1, 1, 0]
    //   ],
    //   [ // Then
    //     [n, n, n],
    //     [n, 0, n],
    //     [n, 1, 1]
    //   ],
    // ],
    // [ // Rule
    //   [ // When
    //     [n, n, n],
    //     [n, 1, n],
    //     [0, 1, 0]
    //   ],
    //   [ // Then
    //     [n, n, n],
    //     [n, 0, n],
    //     [1, 1, n]
    //   ],
    // ],
    // [ // Rule
    //   [ // When
    //     [n, 0, n],
    //     [n, 2, n],
    //     [n, n, n]
    //   ],
    //   [ // Then
    //     [n, 2, n],
    //     [n, 0, n],
    //     [n, n, n]
    //   ],
    // ],
    // [ // Rule
    //   [ // When
    //     [n, 1, n],
    //     [n, 2, n],
    //     [n, n, n]
    //   ],
    //   [ // Then
    //     [n, 2, n],
    //     [n, 1, n],
    //     [n, n, n]
    //   ],
    // ],
    // [ // Rule
    //   [ // When
    //     [2, 2, 2],
    //     [2, 2, 2],
    //     [2, 2, 2]
    //   ],
    //   [ // Then
    //     [n, n, n],
    //     [n, 3, n],
    //     [n, n, n]
    //   ],
    // ],
  ]
}


for (let y = 0; y < state.rows; y++) {
  state.grid[y] = []
  for (let x = 0; x < state.columns; x++) {
    // state.grid[y][x] = parseInt(Math.random() * 3)
    // state.grid[y][x] = (x + y) % 16
    // state.grid[y][x] = parseInt(Math.hypot( x-(state.rows/2), y-(state.columns/2) )) % 16
    // state.grid[y][x] = parseInt(2*Math.hypot( x-(state.rows/2), y-(state.columns/2) )) % 16
    state.grid[y][x] = parseInt((2+Math.sin((x+y)/Math.PI))*Math.hypot( x-(state.rows/2), y-(state.columns/2) )) % 16
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
  setInterval(() => {
    state.grid = applyRules(state.grid, state.rules)
    render('body', Layout(state))
  }, 1000/12)
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
    mousedown: () => {
      state.dragging = true
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
