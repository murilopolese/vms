function dec2bin(dec) {
  return (dec >>> 0).toString(2)
}

function oct2dec(oct) {
  return parseInt(oct, 8)
}

function dec2oct(dec) {
  return dec.toString(8)
}

function fill(n, length) {
  let m = n
  for (let i = n.length; i < length; i++) {
    m = `0${m}`
  }
  return m
}

function memoryDump(state) {
  return state.memory.map(
    (m, i) => {
      if (i === state.memory[state.regP]) {
        return h('span', { class: 'active' }, fill(dec2oct(m), 3) + ' ')
      }
      return h('span', {}, fill(dec2oct(m), 3) + ' ')
    }
  )
}

let state = {
  regA: oct2dec('000'),
  regB: oct2dec('001'),
  regX: oct2dec('002'),
  regP: oct2dec('003'),
  out: oct2dec('200'),
  OCA: oct2dec('201'), // overflow and carry for regA
  OCB: oct2dec('202'), // overflow and carry for regB
  OCX: oct2dec('203'), // overflow and carry for regX
  input: oct2dec('377'),
  memory: [],
  labels: [
    '7','6','5','4','3','2','1','0',
    'clear','display','set','read',
    'store','run','stop','step'
  ],
  on: false,
  running: false,
  runInterval: 0,
}

for (let i = 0; i < 256; i++) {
  state.memory[i] = 0
}

on('render', () => render('body', Computer(state, emit)))
on('setinput', (e) => {
  let mask = '1'
  for (let i = 0; i < e.detail; i++) {
    mask = `${mask}0`
  }
  state.memory[state.input] |= parseInt(mask, 2)
  emit('render')
})
on('clearinput', (e) => {
  state.memory[state.input] = 0
  emit('render')
})
on('display', (e) => {
  state.memory[state.input] = state.memory[state.regP]
  emit('render')
})
on('set', (e) => {
  state.memory[state.regP] = state.memory[state.input]
  emit('render')
})
on('read', (e) => {
  state.memory[state.input] = state.memory[state.memory[state.regP]]
  state.memory[state.regP] += 1
  emit('render')
})
on('store', (e) => {
  state.memory[state.memory[state.regP]] = state.memory[state.input]
  state.memory[state.regP] += 1
  emit('render')
})
on('step', () => {
  state = execute(state)
  emit('render')
})
on('run', () => {
  state.running = true
  state.runInterval = setInterval(() => emit('step'), 250)
})
on('stop', () => {
  state.running = false
  clearInterval(state.runInterval)
})

function Button(opts, child) {
  const { click } = opts
  return h('button', { click }, child || '')
}

function LED(opts) {
  const { on } = opts
  if (parseInt(on)) {
    return h('div', { class: 'led on' })
  } else {
    return h('div', { class: 'led' })
  }
}

function Computer(state, emit) {
  const input = fill(dec2bin(state.memory[state.input]), 8)
  return [
    h('div', { id: 'computer' },
      h('div', { id: 'logo' }, 'KENBAKy-0'),
      h('ul', { class: 'leds' },
        h('li', { class: 'slot' }),
        ...input.split('').map((l) => h('li', { class: 'slot' }, LED({on: l}))
        ),
        h('li', { class: 'slot' }),
        h('li', { class: 'screen' }, ...memoryDump(state)),
        h('li', { class: 'slot' }),
      ),
      h('ul', { class: 'labels' },
        h('li', { class: 'slot' }),
        ...state.labels.map((l) => h('li', { class: 'slot' }, l)
        ),
        h('li', { class: 'slot' })
      ),
      h('ul', { class: 'buttons' },
        h('li', { class: 'slot' }),
        h('li', { class: 'slot' }, Button({ click: () => emit('setinput', 7)})),
        h('li', { class: 'slot' }, Button({ click: () => emit('setinput', 6)})),
        h('li', { class: 'slot' }, Button({ click: () => emit('setinput', 5)})),
        h('li', { class: 'slot' }, Button({ click: () => emit('setinput', 4)})),
        h('li', { class: 'slot' }, Button({ click: () => emit('setinput', 3)})),
        h('li', { class: 'slot' }, Button({ click: () => emit('setinput', 2)})),
        h('li', { class: 'slot' }, Button({ click: () => emit('setinput', 1)})),
        h('li', { class: 'slot' }, Button({ click: () => emit('setinput', 0)})),
        h('li', { class: 'slot' }, Button({ click: () => emit('clearinput')})),
        h('li', { class: 'slot' }, Button({ click: () => emit('display')})),
        h('li', { class: 'slot' }, Button({ click: () => emit('set')})),
        h('li', { class: 'slot' }, Button({ click: () => emit('read')})),
        h('li', { class: 'slot' }, Button({ click: () => emit('store')})),
        h('li', { class: 'slot' }, Button({ click: () => emit('run')})),
        h('li', { class: 'slot' }, Button({ click: () => emit('stop')})),
        h('li', { class: 'slot' }, Button({ click: () => emit('step')})),
        h('li', { class: 'slot' }),
      ),
    ),
    h('a', {
      href: 'http://www.kenbakkit.com/manuals.html',
      target: '_blank',
      class: 'rtfm'
    }, 'RTFM')
  ]
}

window.onload = function() {
  emit('render')
}
