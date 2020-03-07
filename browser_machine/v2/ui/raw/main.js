const vm = require('../../lib/vm')
let state = vm.getCleanState()

let getCurrentInstruction = function(state) {
	return state.program[state.programPointer]
}
let getCurrentOpcode = function(instruction) {
	return vm.getOpcode(instruction)
}

const bin = function(n, size) {
	let b = (n>>>0).toString(2)
	for (let i = b.length; i < size; i++) {
		b = `0${b}`
	}
	return b
}
const renderAddress = function(data, i, sel) {
	return `
	<div class="address ${i==sel ? 'selected' : ''}" id="address-${i}">
		<span class="index">${i}</span>
		<input type="text"
		class="value"
		name="${i}"
		value="${bin(data, 16)}"
		/>
	</div>
	`
}

const renderTable = function(data, pointer) {
	let table = []
	for(i in data) {
		table.push(renderAddress(data[i], i, pointer))
	}
	return `
		<div class="table">
			${table.join('')}
		</div>
	`
}

let programTable = document.querySelector('#program') || {}
let memoryTable = document.querySelector('#memory') || {}
let registersTable = document.querySelector('#registers') || {}
let cockpit = document.querySelector('#cockpit') || {}

programTable.innerHTML = `
<h2>Program</h2>
${renderAddress(state.programPointer, 'Program Pointer')}
<hr />${renderTable(state.program, state.programPointer)}<hr />
`

memoryTable.innerHTML = `
<h2>Memory</h2>
${renderAddress(state.memoryPointer, 'Memory Pointer')}
<hr />${renderTable(state.memory, state.memoryPointer)}<hr />
`

registersTable.innerHTML = `
<h2>Registers</h2>
<hr />${renderTable(state.registers)}<hr />
`

let clockSpeed = 100
let clockInterval = 1000
let clockTicks = 0
cockpit.innerHTML = `
<h2>Cockpit</h2>
<div>
	<button onclick="execute()">Execute</button>
	<button onclick="run()">Run</button>
	<button onclick="stop()">Stop</button>
	<input name="clock_speed" type="range" min="100" max="2000" value="${clockInterval}" onchange="clockChange(this.value)" />
	<span id="clockTicks">${clockTicks}</span>
</div>
<h5>
	Current program instruction: ${getCurrentOpcode(getCurrentInstruction(state))}
</h5>
`
window.execute = function() {
	let instruction = getCurrentInstruction(state)
	let opcode = getCurrentOpcode(instruction)
	state = vm.opcodes[opcode](state, instruction)
	console.log('executed')
}
window.run = function() {
	console.log('run')
	clockInterval = setInterval(
		function() {
			execute()
			state.programPointer++
			clockTicks++
			console.log('tick')
		},
		clockInterval
	)
}
window.stop = function() {
	state.running = false
	clearInterval(clockInterval)
	console.log('stoped')
}
window.clockChange = function(val) {
	clockInterval = val
	console.log('clockChanged', val)
}
