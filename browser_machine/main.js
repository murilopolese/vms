let state
const prettyPrintHex = function(number) {
	if (number === true) number = 1
	if (number === false) number = 0
	let hex = number.toString(16).toUpperCase()
	while (hex.length < 6) {
		hex = `0${hex}`
	}
	return `0x${hex}`
}

const getCleanState = function() {
	let program = new Array(56)
	let programPointer = 0x0000
	let memory = new Array(8)
	let memoryPointer = 0x0000
	let stack = new Array(8)
	let stackPointer = 0x0000
	let registers = [0x0000, 0x0000]
	for (let i = 0; i < program.length; i++) {
		program[i] = 0x0000
	}
	for (let i = 0; i < memory.length; i++) {
		memory[i] = 0x0000
	}
	for (let i = 0; i < stack.length; i++) {
		stack[i] = 0x0000
	}
	return {
		program, programPointer, memory, memoryPointer,
		stack, stackPointer, registers
	}
}
const renderPanel = function(state) {
	let instruction = state.program[state.programPointer]
	let operator = instruction >> 16
	let operand = instruction & 0xffff
	// Check if an item is active
	let isActive = function(type, i) {
		if (
			(type === 'program' && i == state.programPointer)
			|| (type === 'memory' && i == state.memoryPointer)
			|| (type === 'stack' && i == state.stackPointer)
		)
		{
			return 'active'
		} else {
			return ''
		}
	}
	// Wrap address with a span so it can be highlighted
	let wrapAddress = function(type) {
		return function(item, i) {
			return `<span class="${isActive(type, i)}">${prettyPrintHex(item)}</span>`
		}
	}
	return `
	<div>
		<h3>Current instruction</h3>
		<code>
			${prettyPrintHex(instruction)} -
			${getOpcodeName(operator)}
			0x${(operand >> 8).toString(16)}
			0x${(operand & 0xff).toString(16)}
		</code>
	</div>
	<div>
		<h3>Registers</h3>
		<code>${state.registers.map(prettyPrintHex).join(' ')}</code>
	</div>
	<div>
		<h3>Program</h3>
		<code>${state.program.map(wrapAddress('program')).join(' ')}</code>
		<h3>Program pointer</h3>
		<code>${prettyPrintHex(state.programPointer)}</code>
	</div>
	<div>
		<h3>Memory</h3>
		<code>${state.memory.map(wrapAddress('memory')).join(' ')}</code>
		<h3>Memory pointer</h3>
		<code>${prettyPrintHex(state.memoryPointer)}</code>
	</div>
	<div>
		<h3>Stack</h3>
		<code>${state.stack.map(wrapAddress('stack')).join(' ')}</code>
		<h3>Stack pointer</h3>
		<code>${prettyPrintHex(state.stackPointer)}</code>
	</div>
`
}

// Handle CPU Operations
const handleExecuteInstruction = function() {
	state = executeInstruction(state)
	render(state)
}
const handleSetProgramPointer = function() {
	state = setProgramPointer(state, state.registers[0])
	render(state)
}
const handleSetMemoryPointer = function() {
	state = setMemoryPointer(state, state.registers[0])
	render(state)
}
const handleWriteToMemory = function() {
	state = writeToMemory(state)
	render(state)
}
const handleLoadFromMemory = function() {
	state = loadFromMemory(state)
	render(state)
}
const handleSetStackPointer = function() {
	state = setStackPointer(state, state.registers[0])
	render(state)
}
const handlePush = function() {
	state = pushToStack(state)
	render(state)
}
const handlePop = function() {
	state = popFromStack(state)
	render(state)
}
const handleLoadValueToRegister = function() {
	let valueInput = document.querySelector('input[name=value]')
	let registerInput = document.querySelector('input[name=register]')
	let value = parseInt(valueInput.value, 16)
	let register = parseInt(registerInput.value, 16)
	let operand = (register << 8) | value
	state = loadValueToRegister(state, operand)
	render(state)
}
const handleLoadRegisterToRegister = function() {
	let fromInput = document.querySelector('input[name=register_from]')
	let toInput = document.querySelector('input[name=register_to]')
	let from = parseInt(fromInput.value, 16)
	let to = parseInt(toInput.value, 16)
	let operand = (to << 8) | from
	state = loadRegisterToRegister(state, operand)
	render(state)
}
// Handle ALU
const handleAdd = function() {
	state = add(state)
	render(state)
}
const handleSubtract = function() {
	state = subtract(state)
	render(state)
}
const handleMultiply = function() {
	state = multiply(state)
	render(state)
}
const handleDivide = function() {
	state = divide(state)
	render(state)
}
const handleGreaterThan = function() {
	state = greaterThan(state)
	render(state)
}
const handleLesserThan = function() {
	state = lesserThan(state)
	render(state)
}
const handleEquals = function() {
	state = equals(state)
	render(state)
}
const handleNot = function() {
	state = not(state)
	render(state)
}
const handleAnd = function() {
	state = and(state)
	render(state)
}
const handleOr = function() {
	state = or(state)
	render(state)
}
const handleXor = function() {
	state = xor(state)
	render(state)
}
const handleBitwiseAnd = function() {
	state = bitwiseAnd(state)
	render(state)
}
const handleBitwiseOr = function() {
	state = bitwiseOr(state)
	render(state)
}
const handleBitshiftRight = function() {
	state = bitshiftRight(state)
	render(state)
}
const handleBitshiftLeft = function() {
	state = bitshiftLeft(state)
	render(state)
}
const handleEqualsZero = function() {
	state = equals0(state)
	render(state)
}
const handleGreaterThanZero = function() {
	state = greaterThan0(state)
	render(state)
}
const handleLesserThanZero = function() {
	state = lesserThan0(state)
	render(state)
}
const handleLoadProgram = function() {
	let codeInput = document.querySelector('textarea[name=program]')
	let program = codeToBin(codeInput.value)
	for (i in program) {
		state.program[i] = program[i]
	}
	render(state)
}
const handleSpeedChange = function(e) {
	interval = e.value
}

// Runtime
let timeout = 0
let interval = 200
const tick = function() {
	try {
		handleExecuteInstruction()
		timeout = setTimeout(tick, interval)
	} catch (e) {
		console.log('halted', e)
	}
}
const handleRun = function() {
	handleStop()
	tick()
}
const handleStop = function() {
	clearTimeout(timeout)
}
const handleReset = function() {
	state = getCleanState()
	render(state)
}

// Rendering panel
const render = function() {
	let panel = document.querySelector('#panel')
	panel.innerHTML = renderPanel(state)
}
const program =
`LOAD_VAL_REG 0x0 0x0
LOAD_VAL_REG 0x1 0x1
LOAD_VAL_REG 0x4 0x2
ADD
PUSH
LOAD_REG_REG 0x2 0x1
SUBTRACT
LT0
JUMP_IF
SET_PP 0xb
POP
SET_PP 0x0
LOAD_VAL_REG 0x69 0x0
WRITE_MEM
HALT`

const chaser =
`LOAD_VAL_REG 0x1 0x0
SET_MP 0x0
WRITE_MEM
SET_PP 0x12
# Shift left === 0x4
SET_MP 0x0
LOAD_MEM
LOAD_VAL_REG 0x4 0x1
SHIFTLEFT
WRITE_MEM
RETURN
# Shift right === 0xb
SET_MP 0x0
LOAD_MEM
LOAD_VAL_REG 0x4 0x1
SHIFTRIGHT
WRITE_MEM
RETURN
# shift left 4 times === 0x12
GO_SUB 0x4
SET_MP 0x1
LOAD_MEM
LOAD_VAL_REG 0x1 0x1
ADD
WRITE_MEM
LOAD_VAL_REG 0x5 0x1
SUBTRACT
EQUALS0
JUMP_IF
SET_PP 0x12
LOAD_VAL_REG 0x0 0x0
SET_MP 0x1
WRITE_MEM
# shift right 4 times === 0x21
GO_SUB 0xb
SET_MP 0x1
LOAD_MEM
LOAD_VAL_REG 0x1 0x1
ADD
WRITE_MEM
LOAD_VAL_REG 0x5 0x1
SUBTRACT
EQUALS0
JUMP_IF
SET_PP 0x21
LOAD_VAL_REG 0x0 0x0
SET_MP 0x1
WRITE_MEM
SET_PP 0x12
`

const example_gosub =
`SET_PP 0x7
# YOLO + 1
LOAD_VAL_REG 0x1 0x1
SET_MP 0x0
LOAD_MEM
ADD
WRITE_MEM
RETURN
GO_SUB 0x1
SET_PP 0x7
`

window.onload = function() {
	let codeInput = document.querySelector('textarea[name=program]')
	codeInput.innerHTML = chaser
	state = getCleanState()
	render(state)
}
