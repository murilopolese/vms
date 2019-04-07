const assert = require('assert')
const fs = require('fs').promises
const esprima = require('esprima')
const debug = true

// Those are just handy
const log = function(...args) {
	if (debug) console.log(...args)
}
const hex = function (int) {
	return `${int.toString(16).toUpperCase()}`
}
const padHex = function (int, pad) {
	pad = pad || 4
	let v = hex(int)
	for (let i = v.length; i < pad; i++) {
		v = `0${v}`
	}
	return v
}
const indexOf = function (item, array) {
	return array.indexOf(item)
}
const map = function (x, in_min, in_max, out_min, out_max) {
	return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}
const flatten = function (arr) {
	return arr.reduce(function (flat, toFlatten) {
		return flat.concat(
			Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
		)
	}, []);
}
let concat = function(...arrays) {
	return arrays.reduce(function (previous, current) {
		return [].concat(previous, current)
	})
}

// These are the program and subroutine "spaces". We'll store bytecodes on them
let program = []
// Subroutines are stored somewhere else then the memory until all the nodes
// are processed. Once they are processed, the subroutines are concatenated
// to the memory and all the
let subroutines = []

// `memory_position`: The position in memory. This position can be a fixed point
// in memory or an address that will be calculated later. Usually the values
// calculated later refers to a globalId, globalCall, subroutine and can only
// be calculated once all the syntax tree is processed.
// [ program ][ subroutines ][ globalIds ]

// Everytime code refers to identifiers, it will load or write the value
// to a `memory_position`, which may be used by an external process as
// reference. This values will be written after the program and subroutines.
const globalIds = ['sine', 'triangle', 'square', 'pulse', 'rampdown', 'rampup']
const globalIdsValues = [ 0, 1, 2, 3, 4, 5 ]


// Every time code calls an expression that is a global call it will put the
// arguments on the registers, call the op code. This opcode will likely to do
// some calculation and if there is a result data it will be written to its
// `memory_position`.
const globalCalls = [
	'leftEye', 'rightEye', 'leftMouth', 'rightMouth',
	'leftArm', 'servo1', 'servo2',
	'wave', 'leftArmTouched', 'hornTouched'
]


// Calculate the `memory_position` of subroutines. To call this function, all
// the program must be already loaded, so it can add the correct offset (the
// program length) to those ids.
const getSubroutineAddress = function (id) {
	let index = indexOf(id, subroutineIds)
	return program.length + index
}
// Calculate the `memory_position` of identifiers. To call this function, all
// the program and subroutines must be already loaded, so it can add the
// correct offset (the program length + subroutines length) to those ids.
const getIdAddress = function (id) {
	let index = indexOf(id, globalIds)
	if (index != -1) {
		return program.length + subroutines.length + index
	} else {
		throw new Error(`Identifier '${id}' is not defined`)
	}
}


// The following functions will generate bytecodes or a function to be called
// to calculate that bytecode. Usually opcodes that takes registers and values
// will just return the bytecode while those that referes to a memory address
// must be calculated once all the program (and its nodes) are processed.
const loadFloatToRegister = function (value, register) {
	let v = parseInt(map(value, 0.0, 1.0, 0x00, 0xFF))
	return loadValueToRegister(v, register)
}
const loadValueToRegister = function (value, register) {
	if(debug) log(`load value 0x${hex(value)} to register 0x${hex(register)}`)
	return `6${padHex(register, 1)}${padHex(value, 2)}`
}
const loadValueToMemory = function (value, id) {
	if(debug) log(`load value 0x${hex(value)} to memory address '${id}'`)
	return [
		function (i) {
			let address = getIdAddress(id)
			return `A${padHex(address, 3)}` // Move I to address
		},
		`6${padHex(0, 1)}${padHex(value, 2)}`, // Load value to register 0
		`F${padHex(0, 1)}55` // Write value of register 0 to memory on address I
	]
}
const loadRegisterToMemory = function (register, id) {
	if(debug) log(`load value from register 0x${hex(register)} to memory address '${id}'`)
	return [
		function (i) {
			let address = getIdAddress(id)
			return `A${padHex(address, 3)}` // Move I to address
		},
		`F${padHex(register, 1)}55` // Write value of register to memory on address I
	]
}
const loadMemoryToRegister = function (id, register) {
	if(debug) log(`load value from memory address '${id}' to register 0x${padHex(register, 1)}`)
	return [
		function (i) {
			let address = getIdAddress(id)
			return `A${padHex(address, 3)}` // Move I to address
		},
		`F${padHex(register, 1)}65` // Load value from memory I to register
	]
}
const goToSubroutine = function (id) {
	if(debug) log(`go to subroutine on memory address '${id}'`)
	return function (i) {
		let address = getSubroutineAddress(id)
		return `2${padHex(address, 3)}`
	}
}
const callGlobal = function(name) {
	if(debug) log(`call for global '${name}' (expects to write result to register 0x0)`)
	return [name]
}

// Tree node types
const AssignmentExpression = function (operator, left, right) {
	assert(operator, '=')
	assert(left.type, 'Identifier')
	// Right hand first. The right hand side is an address of something
	// we will load to the first register
	let rightHandCode = []
	switch (right.type) {
		case 'Literal':
			rightHandCode = loadFloatToRegister(right.value, 0x0)
			break
		case 'Identifier':
			rightHandCode = loadMemoryToRegister(right.name, 0x0)
			break
		case 'CallExpression':
			rightHandCode = CallExpression(right.callee, right.arguments)
			break
		default:
			throw new Error(`Can't assign this value.`)
	}

	// Now the left hand side is an address in memory we want to write whatever
	// is on the first register!
	if (indexOf(left.name, globalIds) === -1) {
		globalIds.push(left.name)
	}
	leftHandCode = loadRegisterToMemory(0x0, left.name)
	return concat(rightHandCode, leftHandCode)
}

const CallExpression = function (callee, arguments) {
	// Load arguments to registers
	let code = []
	arguments.forEach(function (arg, i) {
		if (arg.type == 'Literal') {
			code = concat(code, loadFloatToRegister(arg.value, i))
		} else if (arg.type == 'Identifier') {
			code = concat(code, loadMemoryToRegister(arg.name, i))
		} else {
			throw new Error("Argument is not valid.")
		}
	})
	// Assuming it will only call globals for now
	code = concat(code, callGlobal(callee.name))
	return code
}

const processNode = (node) => {
	let code = []
	switch (node.type) {
		case 'ExpressionStatement':
			code = processNode(node.expression)
			break
		case 'IfStatement':
			// TODO: Here I'll have to introduce a space to store subroutines
			code = []
			break
		case 'AssignmentExpression':
			code = AssignmentExpression(node.operator, node.left, node.right)
			break
		case 'CallExpression':
			code = CallExpression(node.callee, node.arguments)
			break
	}
	return code
}


// This load the file and parse the sintax tree
const loadFile = async function (filename) {
	return await fs.readFile(filename, "utf8")
}
const getSyntaxTree = (codeString) => {
	return esprima.parseScript(codeString)
}

const main = async function () {
	// const codeString = await loadFile('quirkbot_factory.js')
	const codeString = await loadFile('simple_test.js')
	const ast = getSyntaxTree(codeString)
	// Write down Abstract Syntax Tree
	await fs.writeFile('ast.json', JSON.stringify(ast, null, 2))

	log('======= PROCESSING NODES ===========')
	// Final bytecode can be obtained in 3 steps:
	// 1) Process the syntax tree nodes and create an array of values and functions
	// to calculate relative values
	// 2) Calculate the relative values on program and subroutines
	// 3) Concatenate program, subroutines and default globalId values

	// Process syntax tree nodes and create an array of values and functions
	let code = ast.body.map(processNode)
	program = flatten(code)

	// Iterate over program and subroutines and calculating relative addresses
	const calculateBytecode = function (item) {
		if (typeof item === 'function') {
			return item()
		} else {
			return item
		}
	}
	program = program.map(calculateBytecode)
	subroutines = subroutines.map(calculateBytecode)
	// Get an array with default global values and initialized memory with 0x0
	// for variables without default value
	let idValues = globalIds.map(function (id, i) {
		if (globalIdsValues[i] !== undefined) {
			return padHex(globalIdsValues[i], 4)
		} else {
			return padHex(0, 4)
		}
	})

	// Concatenate program, subroutines and default globalId values
	let bytecode = flatten(concat(program, subroutines, idValues))


	log('=========== INTERNALS ===============')
	// At this point the functions to get id addresses
	globalIds.forEach(function(id) {
		let address = getIdAddress(id)
		log(` 0x${padHex(address, 3)}: '${id}'`)
	})
	log('=========== BYTECODE ===============')
	log(bytecode.join('\n'))

	return bytecode
}

main()
