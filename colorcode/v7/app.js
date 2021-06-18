const canvas = h('canvas', { width: 48, height: 48 })
const ctx = canvas.getContext('2d')

const n = null
window.state = {
  data: [],
  interval: 0
}

window.onload = function() {
  render('#console', Console())
  document.body.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
      case 'arrowup':
        executeColumnWith16Rules(6)
      break
      case 'arrowright':
        executeColumnWith16Rules(12)
      break
      case 'arrowdown':
        executeColumnWith16Rules(18)
      break
      case 'arrowleft':
        executeColumnWith16Rules(24)
      break
      case 'z':
        executeColumnWith10Rules(30)
      break
      case 'x':
        executeColumnWith10Rules(36)
      break
      default:
      break
    }
  })
}

function getArrayOfColors(rawData) {
  const data = []
  for (let i = 0; i < rawData.length; i += 4) {
    data[parseInt(i/4)] = [
      rawData[i],
      rawData[i+1],
      rawData[i+2],
      rawData[i+3]
    ]
  }
  return data
}

function drawOnCanvas() {
  const data = window.state.data
  ctx.fillStyle = `#333`
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  data.forEach((c, i) => {
    ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`
    ctx.fillRect(i%48, parseInt(i/48), 1, 1)
  })
}

function getIndex(x, y) {
  return (x % 48) + (y * 48)
}

function getRule(x, y) {
  const data = window.state.data
  let rule = [
    [ // when
      [n, n, n],
      [n, n, n],
      [n, n, n]
    ],
    [ // then
      [n, n, n],
      [n, n, n],
      [n, n, n]
    ]
  ]
  for (let _x = 0; _x < 3; _x++) {
    for (let _y = 0; _y < 3; _y++) {
      rule[0][_y][_x] = data[getIndex(x+_x, y+_y)]
      rule[1][_y][_x] = data[getIndex(3+x+_x, y+_y)]
    }
  }
  return rule
}

function matchRule(x, y, rule) {
  const data = window.state.data
  let cell = data[getIndex(x, y)].toString()
  let centerRule = rule[0][1][1] ? rule[0][1][1].toString() : ''
  if (cell !== centerRule) {
    return false
  }
  let matched = true
  for (let _x = 0; _x < 3; _x++) {
    for (let _y = 0; _y < 3; _y++) {
      if (rule[0][_y][_x][3] > 0) {
        if (
            rule[0][_y][_x] && rule[0][_y][_x].toString() !==
            data[getIndex(x+_x-1, y+_y-1)].toString()
          ) {
            matched = false
          }
      }
    }
  }
  return matched
}

function applyRule(x, y, rule, data) {
  for (let _x = 0; _x < 3; _x++) {
    for (let _y = 0; _y < 3; _y++) {
      if (rule[1][_y][_x][3] > 0) {
        data[getIndex(x+_x-1, y+_y-1)] = rule[1][_y][_x].slice()
      }
    }
  }
}

function executeColumnWith16Rules(colIndex) {
  const data = window.state.data.map( c => c.slice() )
  // TICK rules
  let rules = []
  for (let i = 0; i < 16; i++) {
    rules.push(getRule(colIndex, i*3))
  }
  for (let y = 1; y < 17; y++) {
    for (let x = 31; x < 47; x++) {
      for (let i = 0; i < rules.length; i++) {
        let rule = rules[i]
        let matched = matchRule(x, y, rule)
        if (matched) {
          applyRule(x, y, rule, data)
        }
      }
    }
  }
  window.state.data = data
}

function executeColumnWith10Rules(colIndex) {
  const data = window.state.data.map( c => c.slice() )
  // TICK rules
  let rules = []
  for (let i = 0; i < 10; i++) {
    rules.push(getRule(colIndex, 18 + i*3))
  }
  for (let y = 1; y < 17; y++) {
    for (let x = 31; x < 47; x++) {
      for (let i = 0; i < rules.length; i++) {
        let rule = rules[i]
        let matched = matchRule(x, y, rule)
        if (matched) {
          applyRule(x, y, rule, data)
        }
      }
    }
  }
  window.state.data = data
}

function Console(state) {
  return h('label', {},
    h('input', {
      class: 'file',
      type: 'file',
      change: (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          const buff = e.target.result
          const img  = UPNG.decode(buff)
          const rawData = new Uint8Array(UPNG.toRGBA8(img)[0])

          // get data as float[4] of colors
          window.state.data = getArrayOfColors(rawData)
          // Render data on screen
          drawOnCanvas()
          render('#screen', canvas)

          // apply rules
          clearInterval(window.state.interval)
          window.state.interval = setInterval(() => {
            executeColumnWith16Rules(0)
            drawOnCanvas()
          }, 1000/12)
        }

        reader.readAsArrayBuffer(file)
      }
    })
  )
}
