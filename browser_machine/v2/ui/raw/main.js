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
const int = function(b) {
	let n = 0
	for (let i = 0; i < b.length; i++) {
		n = n << 1
		if (b[i] == 1) {
			n |= 0b1
		}
	}
	return n
}
const renderAddress = function(data, i, sel) {
	return `
	<div class="address ${i==sel ? 'selected' : ''}" id="address-${i}">
		<span class="index">${i}</span>
		<input type="text"
		class="value"
		name="${i}"
		value="${bin(data, 16)}"
		onchange="changeAddress(this)"
		/>
	</div>
	`
}
const renderProgramPointer = function(data, i, sel) {
	return `
	<div class="address" id="address-pp">
		<span class="index">Program Pointer</span>
		<input type="text"
		class="value"
		name="pp"
		value="${bin(data, 16)}"
		onchange="changeProgramPointer(this)"
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

let clockSpeed = 1000
let clockTicks = 0
let interval = 0

function render() {
programTable.innerHTML = `
<h2>Program</h2>
${renderProgramPointer(state.programPointer)}
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
cockpit.innerHTML = `
<h2>Cockpit</h2>
<div>
	<button onclick="execute()">Execute</button>
	<button onclick="run()">Run</button>
	<button onclick="stop()">Stop</button>
	<label>
		Clock speed:
		<input name="clockSpeed" type="range" min="100" max="2000" value="${clockSpeed}" onchange="clockChange(this.value)" />
	</label>
	<label>
		Clock ticks:
		<span id="clockTicks">${clockTicks}</span>
	</label>
	<input type="file" onchange="changeBinaryFile(this)" name="binfile" />
</div>
<h5>
	Current program pointer: ${state.programPointer} <br />
	Current program instruction: ${getCurrentOpcode(getCurrentInstruction(state))}
</h5>
`
}
render()

window.execute = function() {
	let instruction = getCurrentInstruction(state)
	let opcode = getCurrentOpcode(instruction)
	if (opcode === 'halt') {
		clearInterval(interval)
	} else {
		state.programPointer++
		clockTicks++
	}
	state = vm.opcodes[opcode](state, instruction)
	console.log('executed', opcode, instruction)
	render()
}
window.run = function() {
	console.log('run')
	interval = setInterval(
		function() {
			execute()
		},
		clockSpeed
	)
}
window.stop = function() {
	clockTicks = 0
	state.running = false
	state.programPointer = 0
	clearInterval(interval)
	console.log('stoped')
	render()
}
window.clockChange = function(val) {
	clockSpeed = val
	console.log('clockChanged', val)
	render()
}
window.changeAddress = function(e) {
	let index = e.getAttribute('name') || 0
	let instruction = int(e.value)
	state.program[index] = instruction
	render()
}
window.changeProgramPointer = function(e) {
	state.programPointer = int(e.value)
	render()
}
window.changeBinaryFile = function(e) {
	let file = e.files[0]
	let reader = new FileReader()
	reader.readAsText(file, 'UTF-8')
	reader.onload = function (evt) {
		let result = evt.target.result
		let instructions = result.replace(`\n`, ` `)
		instructions = instructions.split(` `)
		state.program = instructions.map((i) => {
			return parseInt(i, 16)
		})
		render()
	}
	reader.onerror = function (evt) {
		console.log("error reading file")
	}
}
