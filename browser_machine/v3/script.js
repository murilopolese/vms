function VM() {
	this.running = false;
	this.memory = [];
	this.program = [];
	this.registers = [];
	this.program_pointer = 0x0;
	this.overflow_register = 7;

	for (let i = 0; i < 32; i++) {
		this.program[i] = 0x00;
	}
	for (let i = 0; i < 8; i++) {
		this.registers[i] = 0x00;
	}
	for (let i = 0; i < 16; i++) {
		this.memory[i] = 0x00;
	}

	// This will help us extracting info from instruction
	this.get_operator = function(instruction) {
		return (instruction & 0xF000) >> 12;
	}
	this.get_operand = function(instruction) {
		return instruction & 0x0FFF;
	}
	this.get_first_byte = function(operand) {
		return (operand & 0xF00) >> 8;
	}
	this.get_second_byte = function(operand) {
		return (operand & 0x0F0) >> 4;
	}
	this.get_third_byte = function(operand) {
		return operand & 0x00F;
	}
	this.get_number = function(operand) {
		return operand & 0x0FF;
	}

	// Dictionary of all possible operations
	this.operations = {
		0: function noop() {},
		// Data operations
		1: (operand) => {
			let r = this.get_first_byte(operand);
			let nn = this.get_number(operand);
			this.registers[r] = nn;
		},
		2: (operand) => {
			let r = this.get_first_byte(operand);
			let nn = this.get_number(operand);
			this.registers[r] = this.memory[nn];
		},
		3: (operand) => {
			let r = this.get_first_byte(operand);
			let nn = this.get_number(operand);
			this.memory[nn] = this.registers[r];
		},
		// Maths
		4: (operand) => {
			let r1 = this.get_first_byte(operand);
			let r2 = this.get_second_byte(operand);
			let r3 = this.get_third_byte(operand);
			this.registers[r1] = this.registers[r2] + this.registers[r3];
			this.flag_overflow(r1);
		},
		5: (operand) => {
			let r1 = this.get_first_byte(operand);
			let r2 = this.get_second_byte(operand);
			let r3 = this.get_third_byte(operand);
			this.registers[r1] = this.registers[r2] - this.registers[r3];
			this.flag_overflow(r1);
		},
		// Logic
		6: (operand) => {
			let r1 = this.get_first_byte(operand);
			let r2 = this.get_second_byte(operand);
			let r3 = this.get_third_byte(operand);
			this.registers[r1] = this.registers[r2] & this.registers[r3];
		},
		7: (operand) => {
			let r1 = this.get_first_byte(operand);
			let r2 = this.get_second_byte(operand);
			let r3 = this.get_third_byte(operand);
			this.registers[r1] = this.registers[r2] | this.registers[r3];
		},
		8: (operand) => {
			let r1 = this.get_first_byte(operand);
			let r2 = this.get_second_byte(operand);
			let r3 = this.get_third_byte(operand);
			this.registers[r1] = this.registers[r2] ^ this.registers[r3];
		},
		9: (operand) => {
			let r1 = this.get_first_byte(operand);
			this.registers[r1] = ~ this.registers[r1]
		},
		// Jumps
		10: (operand) => {
			let nn = this.get_number(operand)
			this.program_pointer = nn
		},
		11: (operand) => {
			let r1 = this.get_first_byte(operand);
			let r2 = this.get_second_byte(operand);
			if (this.registers[r1] < this.registers[r2]) {
				this.program_pointer++;
			}
		},
		12: (operand) => {
			let r1 = this.get_first_byte(operand);
			let r2 = this.get_second_byte(operand);
			if (this.registers[r1] > this.registers[r2]) {
				this.program_pointer++;
			}
		},
		13: (operand) => {
			let r1 = this.get_first_byte(operand);
			let r2 = this.get_second_byte(operand);
			if (this.registers[r1] == this.registers[r2]) {
				this.program_pointer++;
			}
		},
		14: () => {},
		15: () => {
			this.running = 0;
		}
	}

	this.execute = function() {
		let instruction = this.program[this.program_pointer];
		let operator = this.get_operator(instruction);
		let operand = this.get_operand(instruction);
		this.operations[operator](operand);
		this.program_pointer++;
		this.program_pointer += this.program.length;
		this.program_pointer %= this.program.length;
	}

	// Flags 0x1 if overflow 255, 0x2 if result is negative and 0x0 otherwise
	this.flag_overflow = function(r1) {
		if (this.registers[r1] > 255) {
			this.registers[this.overflow_register] = 0x1;
		} else if (this.registers[r1] > 255) {
			this.registers[this.overflow_register] = 0x2;
		} else {
			this.registers[this.overflow_register] = 0x0;
		}
		this.registers[r1] = (this.registers[r1] + 255) % 255;
	}

}

const prettyPrintHex = function(number) {
	if (number === undefined) number = 0;
	if (number === true) number = 1;
	if (number === false) number = 0;
	let hex = number.toString(16).toUpperCase();
	while (hex.length < 4) {
		hex = `0${hex}`;
	}
	return `0x${hex}`;
}

function render() {
	let canvas = document.querySelector('.canvas')
	canvas.innerHTML = `<span><strong>Program</strong></span><br>`
	for (let i = 0; i < vm.program.length; i++) {
		canvas.innerHTML += `<span class="data">${prettyPrintHex(vm.program[i])}</span>`
		canvas.innerHTML += ' '
	}
	canvas.innerHTML += `<br><span><strong>Registers</strong></span><br>`
	for (let i = 0; i < vm.registers.length; i++) {
		canvas.innerHTML += `<span class="data">${prettyPrintHex(vm.registers[i])}</span>`
		canvas.innerHTML += ' '
	}
	canvas.innerHTML += `<br><span><strong>Memory</strong></span><br>`
	for (let i = 0; i < vm.memory.length; i++) {
		canvas.innerHTML += `<span class="data">${prettyPrintHex(vm.memory[i])}</span>`
		canvas.innerHTML += ' '
	}
	canvas.innerHTML += '<br><br>'

	let cells = canvas.querySelectorAll('.data')
	let selected = cells.item(vm.program_pointer);
	selected.classList.add('highlight')
}

function btn(id) {
	switch(id) {
		case 'o':
			vm.program_pointer--
			break;
		case 'x':
			vm.program_pointer++
			break;
		case 'run':
			vm.running = true;
			interval = setInterval(function() {
				if (vm.running) {
					vm.execute()
					render()
				} else {
					clearInterval(interval)
				}
			}, 100);
			break;
		case 'stop':
			clearInterval(interval);
			break;
		default:
			if (vm.program_pointer < vm.program.length) {
				let i = vm.program_pointer
				vm.program[i] = vm.program[i] << 4
				vm.program[i] = vm.program[i] | id
				vm.program[i] = vm.program[i] & 0xFFFF
			} else if (
				vm.program_pointer < vm.program.length + vm.registers.length
			) {
				let r = vm.program_pointer - vm.program.length
				vm.registers[r] = vm.registers[r] << 4
				vm.registers[r] = vm.registers[r] | id
				vm.registers[r] = vm.registers[r] & 0xFFFF
			} else if (
				vm.program_pointer < vm.program.length + vm.registers.length + vm.memory.length
			) {
					let r = vm.program_pointer
						- vm.program.length
						- vm.registers.length;
					vm.memory[r] = vm.memory[r] << 4
					vm.memory[r] = vm.memory[r] | id
					vm.memory[r] = vm.memory[r] & 0xFFFF
				}
	}
	let l = vm.program.length
				+ vm.registers.length
				+ vm.memory.length;
	vm.program_pointer = (vm.program_pointer + l) % l;
	render();
}

let vm = new VM();
let interval = 0;
window.onload = function() {
	render();
}
