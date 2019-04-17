const op = require('./opcodes')
const utils = require('./utils')

// Those three concatenated will be the actual program
let program = []
let subroutines = []
let globalIds = []

// Helpers
let globalIdValues = []
let subroutineIds = []
let subroutineAddresses = []
let globalCalls = []

// Calculate the addresses after program is loaded
const calculateAddress(id) {}
const calculateSubroutineAddress(id) {}

// Custom operations
function loadFloatToRegister(float, register) {}
function loadValueToMemory(value, id) {}
function loadRegisterToMemory(register, id) {}
function loadMemoryToRegister(register, id) {}
function gotoSubroutine(id) {}
function callGlobal(id) {}

module.exports {
	program,
	subroutines,
	globalIds,
	globalIdValues,
	subroutineIds,
	subroutineAddresses,
	globalCalls,
	calculateAddress,
	calculateSubroutineAddress,
	loadFloatToRegister,
	loadValueToMemory,
	loadRegisterToMemory,
	loadMemoryToRegister,
	gotoSubroutine,
	callGlobal
}
