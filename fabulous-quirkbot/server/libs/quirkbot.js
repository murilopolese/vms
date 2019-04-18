const MEM_SIZE = 256;
const OFFSET = MEM_SIZE - 26 - 1;

const qb_pins = {
	'LE': 4,
	'RE': 20,
	'LM': 15,
	'RM': 0,
	'HF': 9,
	'HB': 23,

	'LLF': 0,
	'LLB': 0,
	'RLF': 0,
	'RLB': 0,
	'LAF': 0,
	'LAB': 0,
	'RAF': 0,
	'RAB': 0
}

function pwm(pin, value) {
	return [
		0x61, value, // Load value to R1
		0x50, OFFSET + 1 + qb_pins[pin], // Move memory pointer to offset
		0x90, 0x10 // Write R1 to memory Write R0 to memory
	]
}

function halt() {
	return [
		0x10, 0x00 // Halt
	]
}

function update() {
	return [
		0x60, 0x01, // Load value to R0
		0x50, OFFSET, // Move memory pointer to offset
		0x90, 0x00, // Write R0 to memory
	]
}

module.exports = {
	MEM_SIZE,
	OFFSET,
	qb_pins,
	pwm,
	halt,
	update
}
