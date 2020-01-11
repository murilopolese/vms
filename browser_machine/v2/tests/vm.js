const assert = require('chai').assert
const vm = require('../lib/vm.js')

describe('Testing the machine code parsing', function() {
	const opCodeTest = {
		0b0: 'halt',
		0b0110000000000000: 'nop',
		0b0000000000000001: 'read',
		0b0000000000000010: 'write',
		0b0001000000000000: 'setn',
		0b0100000000000000: 'loadr',
		0b0100000000000001: 'storer',
		0b0100000000000010: 'popr',
		0b0100000000000011: 'pushr',
		0b0010000000000000: 'loadn',
		0b0101000000000000: 'addn',
		0b0110000000000000: 'copy',
		0b0110000000000001: 'add',
		0b0111000000000000: 'neg',
		0b0111000000010000: 'sub',
		0b1000000000000000: 'mul',
		0b1001000000000000: 'div',
		0b1010000000000000: 'mod',
		0b0000000000000011: 'jump',
		0b1011000000000000: 'jumpn',
		0b1100000000000000: 'jeqz',
		0b1101000000000000: 'jnez',
		0b1110000000000000: 'jgtz',
		0b1111000000000000: 'jltz',
		0b1011000000000000: 'call',
	}
	it('should recognize the opcode', function(done) {
		Object.keys(opCodeTest).forEach(function(opcode) {
			assert(
				vm.getOpcode(opcode) == opCodeTest[opcode],
				`${opCodeTest[opcode]} == ${vm.getOpcode(opcode)}`
			)
		})
		done()
	})
	it('should get the correct nibbles', function() {
		assert(
			vm.getFirstNibble(0b0000111100000000) == 0b1111,
			`${vm.getFirstNibble(0b0000111100000000)} == 0b1111`
		)
		assert(
			vm.getSecondNibble(0b0000000011110000) == 0b1111,
			`${vm.getSecondNibble(0b0000000011110000)} == 0b1111`
		)
		assert(
			vm.getThirdNibble(0b0000000000001111) == 0b1111,
			`${vm.getThirdNibble(0b0000000000001111)} == 0b1111`
		)
	})
	it('should get lower byte as 8 bit integer', function() {
		assert(vm.getInt8(0x1100) == -128, `${vm.getInt8(0x1100)} == -128`)
		assert(vm.getInt8(0x11FF) == 127, `${vm.getInt8(0x11FF)} == 127`)
		assert(vm.getInt8(0x1180) == 0, `${vm.getInt8(0x1180)} == 0`)
	})
	it('should get lower byte as 8 bit unsigned integer', function() {
		assert(vm.getUint8(0x1100) == 0x00, `${vm.getUint8(0x1100)} == 0x00`)
		assert(vm.getUint8(0x11FF) == 0xFF, `${vm.getUint8(0x11FF)} == 0xFF`)
	})
})

describe('Testing mutators', function() {
	let state
	beforeEach(function() {
		state = vm.getCleanState()
  })

	it('`halt` should set running to false', function() {
		state.running = true
		state = vm.opcodes.halt(state)
		assert(state.running == false, `${state.running} == false`)
	})
	it('`setn` should Load an 8-bit unsigned integer into register rX', function() {
		let instruction = 0b0001000100001010
		state = vm.opcodes.setn(state, instruction)
		assert(
			state.registers[1] == 0b00001010,
			`${state.registers[1]} == ${0b00001010}`
		)
	})
	it('`loadr` should Load register rX from memory word addressed by rY: rX = memory[rY]', function() {
		let instruction = 0b0100000100100000
		state.registers[2] = 0x01 // Address in memory
		state.memory[0x01] = 0xFF // Set that address to 0xFF | 127
		state = vm.opcodes.loadr(state, instruction)
		assert(
			state.registers[1] == 0xFF,
			`${state.registers[1]} == 0xFF`
		)
	})
	it('`storer` should Store contents of register rX into memory word addressed by rY: memory[rY] = rX', function() {
		let instruction = 0b0100000100100000
		state.registers[1] = 0xFF // value to be loaded (uint8)
		state.registers[2] = 0x01 // memory address to store on memory
		state = vm.opcodes.storer(state, instruction)
		assert(
			state.memory[0x1] == 0xFF,
			`${state.memory[0x1]} == 0xFF`
		)
	})
	it('`popr` should Load contents of register rX from stack pointed to by register rY: rY -= 1; rX = memory[rY]', function() {
		let instruction = 0b0100000100100010
		state.registers[2] = 0x02 // decrement of this should point address in memory
		state.memory[0x01] = 0xFF // value in memory to load into rX
		state = vm.opcodes.popr(state, instruction)
		assert(
			state.registers[2] == 0x01,
			`${state.registers[2]} == 0x01`
		)
		assert(
			state.registers[1] == 0xFF,
			`${state.registers[0x1]} == 0xFF`
		)
	})
	it('`pushr` should Store contents of register rX onto stack pointed to by register rY: memory[rY] = rX; rY += 1', function() {
		let instruction = 0b0100000100100011
		state.registers[1] = 0xFF // value to be stored
		state.registers[2] = 0x01 // decrement of this should point address in memory
		state = vm.opcodes.pushr(state, instruction)
		assert(
			state.registers[2] == 0x02,
			`${state.registers[2]} == 0x02`
		)
		assert(
			state.registers[1] == 0xFF,
			`${state.registers[0x1]} == 0xFF`
		)
	})
	it('`loadn` should Load register rX with memory word at address #', function() {
		let instruction = 0b0010000100000001
		state.memory[1] = 0xFF
		state = vm.opcodes.loadn(state, instruction)
		assert(
			state.registers[1] == 0xFF,
			`${state.registers[0x1]} == 0xFF`
		)
	})
	it('`storen` should Store contents of register rX into memory word at address #', function() {
		let instruction = 0b0011000100000001
		state.registers[1] = 0xFF
		state = vm.opcodes.storen(state, instruction)
		assert(
			state.memory[0b00000001] == 0xFF,
			`${state.memory[0b00000001]} == 0xFF`
		)
	})
	it('`addn` should Add the 8-bit unsigned integer to register rX', function() {
		let instruction = 0b0101000100000001
		state.registers[1] = 0x01
		state = vm.opcodes.addn(state, instruction)
		assert(
			state.registers[1] == 0x02,
			`${state.registers[1]} == 0x02`,
		)
	})
	it('`copy` should Set rX = rY', function() {
		let instruction = 0b0110000100100000
		state.registers[1] = 0x00
		state.registers[2] = 0xFF
		state = vm.opcodes.copy(state, instruction)
		assert(
			state.registers[1] == state.registers[2],
			`${state.registers[1]} == ${state.registers[2]}`
		)
	})
	// Not doing this one because we are only dealing with uint types
	// it('`neg` should Set rX = -rY', function() {
	// 	assert(false)
	// })
	it('`add` should Set rX = rY + rZ', function() {
		let instruction = 0b0110000100100011
		state.registers[2] = 0x01
		state.registers[3] = 0xFE
		state = vm.opcodes.add(state, instruction)
		assert(
			state.registers[1] == 0xFF,
			`state.registers[1] == 0xFF`
		)
	})
	it('`add` should overflow gracefully', function() {
		let instruction = 0b0110000100100011
		state.registers[2] = 0x02
		state.registers[3] = 0xFF
		state = vm.opcodes.add(state, instruction)
		assert(
			state.registers[1] == 0x01,
			`${state.registers[1]} == 0x01`
		)
	})
	it('`sub` should Set rX = rY - rZ', function() {
		let instruction = 0b0111000100100011
		state.registers[2] = 0xFF
		state.registers[3] = 0x1
		state = vm.opcodes.sub(state, instruction)
		assert(
			state.registers[1] == 0xFE,
			`${state.registers[1]} == 0xFE`
		)
	})
	it('`sub` should overflow gracefully', function() {
		let instruction = 0b0110000100100011
		state.registers[2] = 0x01
		state.registers[3] = 0x02
		state = vm.opcodes.sub(state, instruction)
		assert(
			state.registers[1] == 0xFF,
			`${state.registers[1]} == 0xFF`
		)
	})
	it('`mul` should Set rX = rY * rZ', function() {
		let instruction = 0b1000000100100011
		state.registers[2] = 0x02
		state.registers[3] = 0x03
		state = vm.opcodes.mul(state, instruction)
		assert(
			state.registers[1] == 0x06,
			`${state.registers[1]} == 0x06`
		)
	})
	it('`mul` should overflow gracefully', function() {
		let instruction = 0b1000000100100011
		state.registers[2] = 0x81
		state.registers[3] = 0x02
		state = vm.opcodes.mul(state, instruction)
		assert(
			state.registers[1] == 0x02,
			`${state.registers[1]} == 0x02`
		)
	})
	it('`div` should Set rX = rY / rZ', function() {
		let instruction = 0b1001000100100011
		state.registers[2] = 0x10
		state.registers[3] = 0x02
		state = vm.opcodes.div(state, instruction)
		assert(
			state.registers[1] == 0x08,
			`${state.registers[1]} == 0x08`
		)
	})
	it('`mod` should Set rX = rY % rZ', function() {
		let instruction = 0b1010000100100011
		state.registers[2] = 0x07
		state.registers[3] = 0x03
		state = vm.opcodes.mod(state, instruction)
		assert(
			state.registers[1] == 0x01,
			`${state.registers[1]} == 0x01`
		)
	})
	it('`jump` should Set program counter to address in rX', function() {
		state.registers[1] = 0xFF
		state = vm.opcodes.jump(state, 0b0000000100000011)
		assert(
			state.programPointer == state.registers[1],
			`${state.programPointer} == ${state.registers[1]}`
		)
	})
	// it('`jumpn` should Set program counter to address #', function() {
	// 	assert(false)
	// })
	// it('`jeqz` should If rX = 0 then set program counter to address #', function() {
	// 	assert(false)
	// })
	// it('`jnez` should If rX ≠ 0 then set program counter to address #', function() {
	// 	assert(false)
	// })
	// it('`jgtz` should If rX > 0 then set program counter to address #', function() {
	// 	assert(false)
	// })
	// it('`jltz` should If rX < 0 then set program counter to address #', function() {
	// 	assert(false)
	// })
	// it('`call` should Set rX to (next) program counter, then set program counter to address #', function() {
	// 	assert(false)
	// })
})
