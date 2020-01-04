// OPCODES
const NOP = 0x0
const HALT = 0x1
const ADD = 0x10
const SUBTRACT = 0x11
const MULTIPLY = 0x12
const DIVIDE = 0x13
const EQUALS = 0x14
const GT = 0x15
const LT = 0x16
const NOT = 0x17
const AND = 0x18
const OR = 0x19
const XOR = 0x1a
const BITOR = 0x1b
const BITAND = 0x1c
const SHIFTRIGHT = 0x1d
const SHIFTLEFT = 0x1e
const EQUALS0 = 0x1f
const GT0 = 0x20
const LT0 = 0x21

const SET_PP = 0x30
const SET_MP = 0x31
const WRITE_MEM = 0x32
const LOAD_MEM = 0x33
const SET_SP = 0x34
const PUSH = 0x35
const POP = 0x36
const LOAD_VAL_REG = 0x37
const LOAD_REG_REG = 0x38
const JUMP_IF = 0x39
const GO_SUB = 0x3a
const RETURN = 0x3b

// ALU
const TRUE = 1
const FALSE = 0
const add = function(state) {
	state.registers[0] = state.registers[0] + state.registers[1]
	return Object.assign({}, state)
}
const subtract = function(state) {
	state.registers[0] = state.registers[0] - state.registers[1]
	return Object.assign({}, state)
}
const multiply = function(state) {
	state.registers[0] = state.registers[0] * state.registers[1]
	return Object.assign({}, state)
}
const divide = function(state) {
	state.registers[0] = state.registers[0] / state.registers[1]
	return Object.assign({}, state)
}
const equals = function(state) {
	state.registers[0] = state.registers[0] == state.registers[1] ? TRUE : FALSE
	return Object.assign({}, state)
}
const greaterThan = function(state) {
	state.registers[0] = state.registers[0] > state.registers[1] ? TRUE : FALSE
	return Object.assign({}, state)
}
const lesserThan = function(state) {
	state.registers[0] = state.registers[0] < state.registers[1] ? TRUE : FALSE
	return Object.assign({}, state)
}
const not = function(state) {
	state.registers[0] = !state.registers[0] ? TRUE : FALSE
	return Object.assign({}, state)
}
const and = function(state) {
	state.registers[0] = state.registers[0] && state.registers[1] ? TRUE : FALSE
	return Object.assign({}, state)
}
const or = function(state) {
	state.registers[0] = state.registers[0] || state.registers[1] ? TRUE : FALSE
	return Object.assign({}, state)
}
const xor = function(state) {
	let a = state.registers[0]
	let b = state.registers[1]
	state.registers[0] = (a && !b) || (!a && b) ? TRUE : FALSE
	return Object.assign({}, state)
}
const bitwiseOr = function(state) {
	state.registers[0] = state.registers[0] | state.registers[1]
	return Object.assign({}, state)
}
const bitwiseAnd = function(state) {
	state.registers[0] = state.registers[0] & state.registers[1]
	return Object.assign({}, state)
}
const bitshiftRight = function(state) {
	state.registers[0] = state.registers[0] >> state.registers[1]
	return Object.assign({}, state)
}
const bitshiftLeft = function(state) {
	state.registers[0] = state.registers[0] << state.registers[1]
	return Object.assign({}, state)
}
const equals0 = function(state) {
	state.registers[0] = state.registers[0] == 0 ? TRUE : FALSE
	return Object.assign({}, state)
}
const greaterThan0 = function(state) {
	state.registers[0] = state.registers[0] > 0 ? TRUE : FALSE
	return Object.assign({}, state)
}
const lesserThan0 = function(state) {
	state.registers[0] = state.registers[0] < 0 ? TRUE : FALSE
	return Object.assign({}, state)
}

// operations
const getFirstValue = function(operand) {
	return operand & 0xff
}
const getSecondValue = function(operand) {
	return operand >> 8
}

const nop = function(state) {
	console.log('nop')
	return state
}
const halt = function(state) {
	throw new Error('Halt')
}
const setProgramPointer = function(state, operand) {
	state.programPointer = operand
	return Object.assign({}, state)
}
const setMemoryPointer = function(state, operand) {
	state.memoryPointer = operand
	return Object.assign({}, state)
}
const loadFromMemory = function(state) {
	state.registers[0] = state.memory[state.memoryPointer]
	return Object.assign({}, state)
}
const writeToMemory = function(state) {
	state.memory[state.memoryPointer] = state.registers[0]
	return Object.assign({}, state)
}
const setStackPointer = function(state, operand) {
	state.stackPointer = operand
	return Object.assign({}, state)
}
const pushToStack = function(state) {
	state.stackPointer++
	state.stack[state.stackPointer] = state.registers[0]
	return Object.assign({}, state)
}
const popFromStack = function(state) {
	state.registers[0] = state.stack[state.stackPointer]
	if (state.stackPointer >= 0) {
		state.stackPointer--
	}
	return Object.assign({}, state)
}
const loadValueToRegister = function(state, operand) {
	let value = getFirstValue(operand)
	let register = getSecondValue(operand)
	state.registers[register] = value
	return Object.assign({}, state)
}
const loadRegisterToRegister = function(state, operand) {
	let from = getFirstValue(operand)
	let to = getSecondValue(operand)
	state.registers[to] = state.registers[from]
	return Object.assign({}, state)
}
const jump_if = function(state) {
	if (state.registers[0] == 1) {
		state.programPointer++
	}
	return Object.assign({}, state)
}
const go_sub = function(state, operand) {
	state.registers[0] = state.programPointer
	state = pushToStack(state) // Save current address on stack
	state.programPointer = operand
	return Object.assign({}, state)
}
const return_from_sub = function(state) {
	state = popFromStack(state)
	state.programPointer = state.registers[0]
	return Object.assign({}, state)
}

let operations = []
operations[NOP] = nop
operations[HALT] = halt

operations[ADD] = add
operations[SUBTRACT] = subtract
operations[MULTIPLY] = multiply
operations[DIVIDE] = divide
operations[EQUALS] = equals
operations[GT] = greaterThan
operations[LT] = lesserThan
operations[NOT] = not
operations[AND] = and
operations[OR] = or
operations[XOR] = xor
operations[BITOR] = bitwiseOr
operations[BITAND] = bitwiseAnd
operations[SHIFTRIGHT] = bitshiftRight
operations[SHIFTLEFT] = bitshiftLeft
operations[EQUALS0] = equals0
operations[GT0] = greaterThan0
operations[LT0] = lesserThan0

operations[SET_PP] = setProgramPointer
operations[SET_MP] = setMemoryPointer
operations[WRITE_MEM] = writeToMemory
operations[LOAD_MEM] = loadFromMemory
operations[SET_SP] = setStackPointer
operations[PUSH] = pushToStack
operations[POP] = popFromStack
operations[LOAD_VAL_REG] = loadValueToRegister // 0x374200
operations[LOAD_REG_REG] = loadRegisterToRegister
operations[JUMP_IF] = jump_if
operations[GO_SUB] = go_sub
operations[RETURN] = return_from_sub

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
const executeInstruction = function(state) {
	let instruction = state.program[state.programPointer]
	let operator = instruction >> 16
	let operand = instruction & 0xFFFF

	state = operations[operator](state, operand)
	state.programPointer++

	return Object.assign({}, state)
}

// Assembler
const getOpcode = function(str) {
	switch (str) {
		case 'ADD':
			return ADD
			break;
		case 'SUBTRACT':
			return SUBTRACT
			break;
		case 'MULTIPLY':
			return MULTIPLY
			break;
		case 'DIVIDE':
			return DIVIDE
			break;
		case 'EQUALS':
			return EQUALS
			break;
		case 'GT':
			return GT
			break;
		case 'LT':
			return LT
			break;
		case 'NOT':
			return NOT
			break;
		case 'AND':
			return AND
			break;
		case 'OR':
			return OR
			break;
		case 'XOR':
			return XOR
			break;
		case 'BITOR':
			return BITOR
			break;
		case 'BITAND':
			return BITAND
			break;
		case 'SHIFTRIGHT':
			return SHIFTRIGHT
			break;
		case 'SHIFTLEFT':
			return SHIFTLEFT
			break;
		case 'EQUALS0':
			return EQUALS0
			break;
		case 'GT0':
			return GT0
			break;
		case 'LT0':
			return LT0
			break;
		case 'SET_PP':
			return SET_PP
			break;
		case 'SET_MP':
			return SET_MP
			break;
		case 'WRITE_MEM':
			return WRITE_MEM
			break;
		case 'LOAD_MEM':
			return LOAD_MEM
			break;
		case 'SET_SP':
			return SET_SP
			break;
		case 'PUSH':
			return PUSH
			break;
		case 'POP':
			return POP
			break;
		case 'LOAD_VAL_REG':
			return LOAD_VAL_REG
			break;
		case 'LOAD_REG_REG':
			return LOAD_REG_REG
			break;
		case 'NOP':
			return NOP
			break;
		case 'HALT':
			return HALT
			break;
		case 'JUMP_IF':
			return JUMP_IF
			break;
		case 'GO_SUB':
			return GO_SUB
			break;
		case 'RETURN':
			return RETURN
			break;
		default:
		return NOP
	}
}
const getOpcodeName = function(opcode) {
	switch (opcode) {
		case ADD:
			return 'ADD'
			break;
		case SUBTRACT:
			return 'SUBTRACT'
			break;
		case MULTIPLY:
			return 'MULTIPLY'
			break;
		case DIVIDE:
			return 'DIVIDE'
			break;
		case EQUALS:
			return 'EQUALS'
			break;
		case GT:
			return 'GT'
			break;
		case LT:
			return 'LT'
			break;
		case NOT:
			return 'NOT'
			break;
		case AND:
			return 'AND'
			break;
		case OR:
			return 'OR'
			break;
		case XOR:
			return 'XOR'
			break;
		case BITOR:
			return 'BITOR'
			break;
		case BITAND:
			return 'BITAND'
			break;
		case SHIFTRIGHT:
			return 'SHIFTRIGHT'
			break;
		case SHIFTLEFT:
			return 'SHIFTLEFT'
			break;
		case EQUALS0:
			return 'EQUALS0'
			break;
		case GT0:
			return 'GT0'
			break;
		case LT0:
			return 'LT0'
			break;
		case SET_PP:
			return 'SET_PP'
			break;
		case SET_MP:
			return 'SET_MP'
			break;
		case WRITE_MEM:
			return 'WRITE_MEM'
			break;
		case LOAD_MEM:
			return 'LOAD_MEM'
			break;
		case SET_SP:
			return 'SET_SP'
			break;
		case PUSH:
			return 'PUSH'
			break;
		case POP:
			return 'POP'
			break;
		case LOAD_VAL_REG:
			return 'LOAD_VAL_REG'
			break;
		case LOAD_REG_REG:
			return 'LOAD_REG_REG'
			break;
		case NOP:
			return 'NOP'
			break;
		case HALT:
			return 'HALT'
			break;
		case JUMP_IF:
			return 'JUMP_IF'
			break;
		case GO_SUB:
			return 'GO_SUB'
			break;
		case RETURN:
			return 'RETURN'
			break;
		default:
		return 'NOP'
	}
}

const lineToInstruction = function(str) {
	const instruction = str.split(' ')
	if(instruction[0] == '#') {
		return 0
	}
	const opcode = getOpcode(instruction[0])
	const args = instruction.slice(1).map((instr) => parseInt(instr, 16))
	const operand = (args[1] << 8) | args[0]
	return (opcode << 16) | operand
}

const codeToBin = function(str) {
	const lines = str.split('\n')
	return lines.map(lineToInstruction)
}
