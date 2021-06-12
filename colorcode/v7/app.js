const n = null
window.state = {
  rows: 48,
  columns: 48,
  data: [],
  interval: 0
}

const canvas = h('canvas', { width: 48, height: 48 })
const ctx = canvas.getContext('2d')

window.onload = function() {
  render('#console', Console())
}

function drawOnCanvas() {
  const data = window.state.data
  const canvas = h('canvas', { width: 48, height: 48 })
  const ctx = canvas.getContext('2d')
  data.forEach((c, i) => {
    ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`
    ctx.fillRect(i%48, parseInt(i/48), 1, 1)
  })
  render('#screen', canvas)
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
  // console.log(rule, getIndex(x, y), data[getIndex(x, y)])
  // return false
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

function step() {
  const data = window.state.data.map( c => c.slice() )
  let rules = []
  for (let i = 0; i < 16; i++) {
    rules.push(getRule(0, i*3))
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
  return h('div', { id: 'app' },
    h('input', {
        type: 'file',
        change: (e) => {
          const file = e.target.files[0]
          const reader = new FileReader()
          reader.onload = (e) => {
            const buff = e.target.result
            const img  = UPNG.decode(buff)
            const rawData = new Uint8Array(UPNG.toRGBA8(img)[0])

            // get data as array of colors
            const data = []
            for (let i = 0; i < rawData.length; i += 4) {
              data[parseInt(i/4)] = [
                rawData[i],
                rawData[i+1],
                rawData[i+2],
                rawData[i+3]
              ]
            }
            window.state.data = data

            drawOnCanvas()

            // apply rules
            clearInterval(window.state.interval)
            window.state.interval = setInterval(() => {
              console.log('tick')
              step()
              drawOnCanvas()
            }, 250)
          }

          reader.readAsArrayBuffer(file)
        }
      })
  )
}
