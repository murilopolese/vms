const assert = require('assert')
const fs = require('fs').promises
const esprima = require('esprima')
const debug = true

// Those are just handy
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
const inArray = function (item, array) {
	return (array.indexOf(item) != -1) ? array.indexOf(item) : false
}
const indexOf = function (item, array) {
	return array.indexOf(item)
}
const map = function (x, in_min, in_max, out_min, out_max) {
	return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}
function flatten(arr) {
	return arr.reduce(function (flat, toFlatten) {
		return flat.concat(
			Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
		)
	}, []);
}

// This is the program we are loading
const memory = [];

// `memory_position`: The position in memory that is a offset plus the index
// representing an item.

// Everytime code refers to global identifiers, it will load or write the value
// to predefined `memory_position`, which may be used by an external process as
// reference.
const globalIds = []
// Every time code calls an expression that is a global call it will put the
// arguments on the registers, call the op code. This opcode will likely to do
// some calculation and if there is a result data it will be written to its
// `memory_position`.
const globalCalls = [
	'leftEye', 'rightEye', 'leftMouth', 'rightMouth',
	'leftArm', 'servo1', 'servo2',

	'wave', 'leftArmTouched', 'hornTouched'
]

// Every time code refers to an identifyier on the "left" side of a statement
// and it's not a global and it's not a local id, append it to the local ids.
// The local ids are also `memory_position` positions.
const localIds = []

// Check if an id is a global or local
const isGlobal = function(id) {
	return globalIds.indexOf(id) != -1
}
const isLocal = function(id) {
	return localIds.indexOf(id) != -1
}

const getGlobalIdAddress = function (index) {
	return index
}
// Calculate the `memory_position` based on the size of global and local
// ids based on the size of the description arrays
const getGlobalCallAddress = function (index) {
	return globalIds.length
		+ index
}
// This is the last one and it grows indefinitely, maybe.
const getLocalIdAddress = function (index) {
	return globalIds.length
		+ globalCalls.length
		+ index
}

// The following functions are a map to the opcodes
const loadFloatToRegister = function (value, register) {
	let v = parseInt(map(value, 0.0, 1.0, 0x00, 0xFF))
	return loadValueToRegister(v, register)
}
const loadValueToRegister = function (value, register) {
	if(debug) console.log(`load value 0x${hex(value)} to register 0x${hex(register)}`)
	return [
		`6${padHex(register, 1)}${padHex(value, 2)}`
	]
}
const loadValueToMemory = function (value, address) {
	if(debug) console.log(`load value 0x${hex(value)} to memory address 0x${hex(address)}`)
	return [
		`A${padHex(address, 3)}`, // Move I to address
		`6${padHex(0, 1)}${padHex(value, 2)}`, // Load value to register 0
		`F${padHex(0, 1)}55` // Write value of register 0 to memory on address I
	]
}
const loadRegisterToMemory = function (register, address) {
	if(debug) console.log(`load value from register 0x${hex(register)} to address memory 0x${hex(address)}`)
	return [
		`A${padHex(address, 3)}`, // Move I to address
		`F${padHex(register, 1)}55` // Write value of register to memory on address I
	]
}
const loadMemoryToRegister = function (address, register) {
	if(debug) console.log(`load value from memory address 0x${hex(address)} to register 0x${hex(register)}`)
	return [
		`A${padHex(address, 3)}`, // Move I to address
		`F${padHex(register, 1)}65` // Load value from memory I to register
	]
}
const callGlobal = function(name) {
	if(debug) console.log(`call for global '${name}' (expects to write result to register 0x0)`)
	return []
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
			if (isGlobal(right.name)) {
				let memoryAddress = getGlobalIdAddress(
					indexOf(right.name, globalIds)
				)
				rightHandCode = loadMemoryToRegister(memoryAddress, 0x0)
			} else if (isLocal(right.name)) {
				let memoryAddress = getLocalIdAddress(
					indexOf(right.name, localIds)
				)
				rightHandCode = loadMemoryToRegister(memoryAddress, 0x0)
			} else {
				throw new Error(`Indentifier '${right.name}' is not defined.`)
			}
			break
		case 'CallExpression':
			rightHandCode = CallExpression(right.callee, right.arguments)
			break
	}

	// Now the left hand side is an address in memory we want to write whatever
	// is on the first register!
	let leftHandCode = []
	let globalIndex = indexOf(left.name, globalIds)
	let localIndex = indexOf(left.name, localIds)
	if (isGlobal(left.name)) {
		let memoryAddress = getGlobalIdAddress(globalIndex)
		leftHandCode = loadRegisterToMemory(0x0, memoryAddress)
	} else if (isLocal(left.name)) {
		let memoryAddress = getLocalIdAddress(localIndex)
		leftHandCode = loadRegisterToMemory(0x0, memoryAddress)
	} else {
		// Add value to local ids and set the value to the memory address
		localIds.push(left.name)
		localIndex = inArray(left.name, localIds)
		let memoryAddress = getLocalIdAddress(localIndex)
		leftHandCode = loadRegisterToMemory(0x0, memoryAddress)
	}
	return [rightHandCode, leftHandCode]
}

const CallExpression = function (callee, arguments) {
	// Load arguments to registers
	let code = []
	arguments.forEach(function (arg, i) {
		if (arg.type == 'Literal') {
			code = code.concat(
				loadFloatToRegister(arg.value, i)
			)
		} else if (arg.type == 'Identifier') {
			let globalIndex = inArray(arg.name, globalIds)
			let localIndex = inArray(arg.name, localIds)
			if (globalIndex !== false) {
				let memoryAddress = getGlobalIdAddress(globalIndex)
				code.concat(
					loadMemoryToRegister(memoryAddress, i)
				)
			} else if (localIndex !== false) {
				let memoryAddress = getLocalIdAddress(localIndex)
				code.concat(
					loadMemoryToRegister(memoryAddress, i)
				)
			} else {
				throw new Error("This identifier can't be assigned.")
			}
		} else {
			throw new Error("Can't use argument.")
		}
	})
	// Assuming it will only call globals for now
	code = code.concat(
		callGlobal(callee.name)
	)
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

	console.log('======= PROCESSING NODES ===========')
	let code = ast.body.map(processNode)

	console.log('=========== INTERNALS ===============')
	console.log('Local identifiers')
	localIds.forEach(function(localId, i) {
		console.log(` ${hex(getLocalIdAddress(i))}: '${localId}'`)
	})

	// Write down Abstract Syntax Tree
	await fs.writeFile('ast.json', JSON.stringify(ast, null, 2))
	// return array containint bytecodes
	return flatten(code)
}

main().then(function (code) {
	console.log('=========== BYTECODE ===============')
	console.log(code.join('\n'))
})
