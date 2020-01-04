/**
 * Takes bytecode in an `ArrayBuffer` and execute it.
 * The virtual machine state consists of program, programPointer, memory,
 * memoryPointer, stack, stackPointer, registers and a flag to identify if
 * the machine is running or not.
 */
const TRUE = 1
const FALSE = 0
const clone = function(object) {
	return Object.assign({}, object)
}
// OPCODES
const nop = function(state) {
	// 	Do nothing
	return clone(state)
}
const halt = function(state) {
	// Stop!	
	state.running = false
	return clone(state)
}
const read = function(state, instruction) {
	// Place user input in register rX
	return clone(state)
}
const write = function(state, instruction) {
	// Place user input in register rX
	return clone(state)
}
const jump = function(state, instruction) {
	const rx = getFirstNibble(instruction)
	state.programPointer = state.registers[rx]
	return clone(state)
}
const setn = function(state, instruction) {
	const int8 = getInt8(instruction)
	const rx = getFirstNibble(instruction)
	state.registers[rx] = int8
	return clone(state)
}
const loadr = function(state, instruction) {
	const rx = getFirstNibble(instruction)
	const ry = getSecondNibble(instruction)
	state.registers[rx] = getInt8(state.program[ry])
	return clone(state)
}
const storer = function(state, instruction) {}
const popr = function(state, instruction) {}
const pushr = function(state, instruction) {}
const loadn = function(state, instruction) {}
const storen = function(state, instruction) {}
const addn = function(state, instruction) {}
const noop = function(state, instruction) {}
const copy = function(state, instruction) {}
const add = function(state, instruction) {}
const neg = function(state, instruction) {}
const sub = function(state, instruction) {}
const mul = function(state, instruction) {}
const div = function(state, instruction) {}
const mod = function(state, instruction) {}
const call = function(state, instruction) {}
const jumpn = function(state, instruction) {}
const jeqz = function(state, instruction) {}
const jnez = function(state, instruction) {}
const jgtz = function(state, instruction) {}
const jltz = function(state, instruction) {}


// Dictionary between mneumonic and actual function
const opcodes = {
	'halt': halt,
	'nop': nop,
	'read': read,
	'write': write,
	'setn': setn,
	'loadr': loadr,
	'storer': storer,
	'popr': popr,
	'pushr': pushr,
	'loadn': loadn,
	'addn': addn,
	'copy': copy,
	'add': add,
	'neg': neg,
	'sub': sub,
	'mul': mul,
	'div': div,
	'mod': mod,
	'jump': jump,
	'jumpn': jumpn,
	'jeqz': jeqz,
	'jnez': jnez,
	'jgtz': jgtz,
	'jltz': jltz,
	'call': call
}

// Machine code parser
const getCleanState = function() {
	let running = false
	let program = new Uint16Array(256)
	let programPointer = 0x0000
	let memory = new Uint16Array(8)
	let memoryPointer = 0x0000
	let stack = new Uint16Array(8)
	let stackPointer = 0x0000
	let registers = new Int8Array(16)
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
		stack, stackPointer, registers, running
	}
}
const getOpcode = function(instruction) {
	switch(instruction >> 12) {
		case 0b0000:
			switch (instruction & 0b1111) {
				case 0b0000:
					return 'halt'
				case 0b0001:
					return 'read'
				case 0b0010:
					return 'write'
				case 0b0011:
					return 'jump'
			}
		case 0b0001:
			return 'setn'
		case 0b0100:
			switch (instruction & 0b1111) {
				case 0b0000:
					return 'loadr'
				case 0b0001:
					return 'storer'
				case 0b0010:
					return 'popr'
				case 0b0011:
					return 'pushr'
			}
		case 0b0010:
			return 'loadn'
		case 0b0011:
			return 'storen'
		case 0b0101:
			return 'addn'
		case 0b0110:
			if (instruction & 0xFFF == 0x000) {
				return 'noop'
			} else if ((instruction & 0b1111) == 0b0000) {
				return 'copy'
			} else {
				return 'add'
			}
		case 0b0111:
			if (((instruction >> 4) & 0b1111) == 0b0000) {
				return 'neg'
			} else {
				return 'sub'
			}
		case 0b1000:
			return 'mul'
		case 0b1001:
			return 'div'
		case 0b1010:
			return 'mod'
		case 0b1011:
			if((instruction & 0xF) == 0x0) {
				return 'call'
			} else if((instruction >> 8) == 0b0000) {
				return 'jumpn'
			}
		case 0b1100:
			return 'jeqz'
		case 0b1101:
			return 'jnez'
		case 0b1110:
			return 'jgtz'
		case 0b1111:
			return 'jltz'
		default:
	}
}
const shiftValues = function(instruction, left, right) {
	instruction = instruction >> right
	instruction = instruction << left
	return instruction
}
const getNibble = function(instruction, shift) {
	shift = shift || {}
	instruction = shiftValues(instruction, shift.left, shift.right)
	return instruction & 0b1111
}
const getFirstNibble = function(instruction) {
	return getNibble(instruction, {right: 8})
}
const getSecondNibble = function(instruction) {
	return getNibble(instruction, {right: 4})
}
const getThirdNibble = function(instruction) {
	return getNibble(instruction)
}
const getInt8 = function(instruction) {
	return (instruction & 0xFF) - 128
}

const vm = {
	getCleanState,
	getOpcode,
	getFirstNibble,
	getSecondNibble,
	getThirdNibble,
	getInt8,
	opcodes
}

module.exports = vm
