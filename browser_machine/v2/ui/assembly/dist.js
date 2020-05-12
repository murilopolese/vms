(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const getNumber = (n) => {
	if (n) {
		if (n.slice(0, 2) === '0x') {
			return parseInt(n, 16)
		} else if (n.slice(0, 2) === '0b') {
			return parseInt(n, 2)
		} else {
			return parseInt(n, 10)
		}
	} else {
		return 0
	}
}

const assembleInstruction = function(line) {
	let words = line.split(` `)
	words[1] = getNumber(words[1])
	words[2] = getNumber(words[2])
	switch (words[0]) {
		case 'halt':
			return 0
			break
		case 'noop':
			return 0b0110000000000000
			break
		case 'setn':
		  return ( ( (0b1 << 4) | words[1] ) << 8 ) | words[2]
			break
		case 'loadr':
		  return ( ( ( (0b0100 << 4) | words[1] ) << 4 ) | words[2] ) << 4
			break
		case 'storer':
		  return ( ( ( ( (0b0100 << 4) | words[1] ) << 4 ) | words[2] ) << 4 ) | 1
			break
		case 'popr':
		  return ( ( ( ( (0b0100 << 4) | words[1] ) << 4 ) | words[2] ) << 4 ) | 2
			break
		case 'pushr':
		  return ( ( ( ( (0b0100 << 4) | words[1] ) << 4 ) | words[2] ) << 4 ) | 3
			break
		case 'setn':
		  return ( ( (0b0010 << 4) | words[1] ) << 8 ) | words[2]
			break
		case 'storen':
		  return ( ( (0b0011 << 4) | words[1] ) << 8 ) | words[2]
			break
		case 'addn':
		  return ( ( (0b0101 << 4) | words[1] ) << 8 ) | words[2]
			break
		case 'copy':
		  return ( ( ( (0b0110 << 4) | words[1] ) << 4 ) | words[2] ) << 4
			break
		case 'add':
		  return ( ( ( ( (0b0110 << 4) | words[1] ) << 4 ) | words[2] ) << 4 ) | words[3]
			break
		case 'sub':
		  return ( ( ( ( (0b0111 << 4) | words[1] ) << 4 ) | words[2] ) << 4 ) | words[3]
			break
		case 'mul':
		  return ( ( ( ( (0b1000 << 4) | words[1] ) << 4 ) | words[2] ) << 4 ) | words[3]
			break
		case 'div':
		  return ( ( ( ( (0b1001 << 4) | words[1] ) << 4 ) | words[2] ) << 4 ) | words[3]
			break
		case 'mod':
		  return ( ( ( ( (0b1010 << 4) | words[1] ) << 4 ) | words[2] ) << 4 ) | words[3]
			break
		case 'jump':
		  return ( ( (0b0 << 4) | words[1] ) << 8 ) | 0b11
			break
		case 'jumpn':
		  return (0b1011 << 12) | words[1]
			break
		case 'jeqz':
		  return ( ( (0b1100 << 4) | words[1] ) << 8 ) | words[2]
			break
		case 'jnez':
		  return ( ( (0b1101 << 4) | words[1] ) << 8 ) | words[2]
			break
		case 'jgtz':
		  return ( ( (0b1110 << 4) | words[1] ) << 8 ) | words[2]
			break
		case 'jltz':
		  return ( ( (0b1111 << 4) | words[1] ) << 8 ) | words[2]
			break
		case 'call':
		  return ( ( (0b1011 << 4) | words[1] ) << 8 ) | words[2]
			break
		default:
		return 0
	}
}

module.exports = assembleInstruction

},{}],2:[function(require,module,exports){
/**
 * Takes bytecode in an `ArrayBuffer` and execute it.
 * The virtual machine state consists of program, programPointer, memory,
 * memoryPointer, registers and a flag to identify if
 * the machine is running or not.
 */
const TRUE = 1
const FALSE = 0
const clone = function(object) {
	return Object.assign({}, object)
}
// OPCODES
const nop = function(state, instruction) {
	return clone(state)
}
const neg = nop
const jgtz = nop
const jltz = nop
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
	const rx = getFirstNibble(instruction)
	state.registers[rx] = getUint8(instruction)
	return clone(state)
}
const loadr = function(state, instruction) {
	const rx = getFirstNibble(instruction)
	const ry = getSecondNibble(instruction)
	state.registers[rx] = state.memory[state.registers[ry]]
	return clone(state)
}
const storer = function(state, instruction) {
	const rx = getFirstNibble(instruction)
	const ry = getSecondNibble(instruction)
	state.memory[state.registers[ry]] = state.registers[rx]
	return clone(state)
}
const popr = function(state, instruction) {
	const rx = getFirstNibble(instruction)
	const ry = getSecondNibble(instruction)
	state.registers[ry] -= 1
	state.registers[rx] = state.memory[state.registers[ry]]
	return clone(state)
}
const pushr = function(state, instruction) {
	const rx = getFirstNibble(instruction)
	const ry = getSecondNibble(instruction)
	state.memory[state.registers[ry]] = state.registers[rx]
	state.registers[ry] += 1
	return clone(state)
}
const loadn = function(state, instruction) {
	let int8 = getUint8(instruction)
	let rx = getFirstNibble(instruction)
	state.registers[rx] = state.memory[int8]
	return clone(state)
}
const storen = function(state, instruction) {
	let int8 = getUint8(instruction)
	let rx = getFirstNibble(instruction)
	state.memory[int8] = state.registers[rx]
	return clone(state)
}
const addn = function(state, instruction) {
	let int8 = getUint8(instruction)
	let rx = getFirstNibble(instruction)
	state.registers[rx] += int8
	return clone(state)
}
const copy = function(state, instruction) {
	let rx = getFirstNibble(instruction)
	let ry = getSecondNibble(instruction)
	state.registers[rx] = state.registers[ry]
	return clone(state)
}
const add = function(state, instruction) {
	let rx = getFirstNibble(instruction)
	let ry = getSecondNibble(instruction)
	let rz = getThirdNibble(instruction)
	state.registers[rx] = state.registers[ry] + state.registers[rz]
	return clone(state)
}
const sub = function(state, instruction) {
	let rx = getFirstNibble(instruction)
	let ry = getSecondNibble(instruction)
	let rz = getThirdNibble(instruction)
	state.registers[rx] = state.registers[ry] - state.registers[rz]
	return clone(state)
}
const mul = function(state, instruction) {
	let rx = getFirstNibble(instruction)
	let ry = getSecondNibble(instruction)
	let rz = getThirdNibble(instruction)
	state.registers[rx] = state.registers[ry] * state.registers[rz]
	return clone(state)
}
const div = function(state, instruction) {
	let rx = getFirstNibble(instruction)
	let ry = getSecondNibble(instruction)
	let rz = getThirdNibble(instruction)
	state.registers[rx] = Math.floor(state.registers[ry] / state.registers[rz])
	return clone(state)
}
const mod = function(state, instruction) {
	let rx = getFirstNibble(instruction)
	let ry = getSecondNibble(instruction)
	let rz = getThirdNibble(instruction)
	state.registers[rx] = state.registers[ry] % state.registers[rz]
	return clone(state)
}
const call = function(state, instruction) {
	let rx = getFirstNibble(instruction)
	let int8 = getUint8(instruction)
	state.registers[rx] = state.programPointer + 1
	state.programPointer = int8
	return clone(state)
}
const jumpn = function(state, instruction) {
	let int8 = getUint8(instruction)
	state.programPointer = int8
	return clone(state)
}
const jeqz = function(state, instruction) {
	let rx = getFirstNibble(instruction)
	let int8 = getUint8(instruction)
	if (state.registers[rx] == 0) {
		state.programPointer = int8
	}
	return clone(state)
}
const jnez = function(state, instruction) {
	let rx = getFirstNibble(instruction)
	let int8 = getUint8(instruction)
	if (state.registers[rx] != 0) {
		state.programPointer = int8
	}
	return clone(state)
}

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
	'storen': storen,
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
	let program = new Uint16Array(128)
	let programPointer = 0x0000
	let memory = new Uint8Array(64)
	let memoryPointer = 0x0000
	let registers = new Uint8Array(16)
	for (let i = 0; i < program.length; i++) {
		program[i] = 0x0000
	}
	for (let i = 0; i < memory.length; i++) {
		memory[i] = 0x0000
	}
	return {
		program, programPointer, memory, memoryPointer, registers, running
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
			if ((instruction & 0xFFF) == 0x000) {
				return 'nop'
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
			if(((instruction >> 8) & 0xF) == 0x0) {
				return 'jumpn'
			} else {
				return 'call'
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
const getUint8 = function(instruction) {
	return instruction & 0xFF
}

const vm = {
	getCleanState,
	getOpcode,
	getFirstNibble,
	getSecondNibble,
	getThirdNibble,
	getInt8,
	getUint8,
	opcodes
}

module.exports = vm

},{}],3:[function(require,module,exports){
const vm = require('../../lib/vm')
const assembleInstruction = require('../../lib/assembler')

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

window.compile = function() {
	let textarea = document.getElementById('screen')
	let printer = document.getElementById('printer')
	let code = textarea.value.split(`\n`)
	code.unshift('noop')
	console.log(code.join(' '))
	code = code.map((line) => assembleInstruction(line))
	console.log(code.map(n => bin(n, 16)).join(' '))
	code = code.map((line) => `0x${line.toString(16)}`)
	console.log(code.join(' '))

	printer.innerText = 'HEX Output: \n'
	code.forEach((line, i) => {
		printer.innerHTML += line
		printer.innerHTML += ` `
	})
}

},{"../../lib/assembler":1,"../../lib/vm":2}]},{},[3]);
