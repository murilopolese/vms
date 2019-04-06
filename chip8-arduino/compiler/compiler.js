const assert = require('assert')
const fs = require('fs').promises
const esprima = require('esprima')

// Those are just handy
const hex = function (int) {
  return `0x${int.toString(16).toUpperCase()}`
}
const inArray = function (item, array) {
  return (array.indexOf(item) != -1) ? array.indexOf(item) : false
}
const map = function (x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
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

// **IMPORTANT NOTE** Both local ids and local calls must be pre-populated
// otherwise their `memory_position` may change during the program execution.

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
  let v = parseInt(map(value, 0.0, 1.0, 0x000, 0xFFFF))
  loadValueToRegister(v, register)
}
const loadValueToRegister = function (value, register) {
  console.log(`load value ${hex(value)} to register ${hex(register)}`)
}
const loadValueToMemory = function (value, address) {
  console.log(`load value ${hex(value)} to memory address ${hex(address)}`)
}
const loadMemoryToRegister = function (address, register) {
  console.log(`load value from memory address ${hex(address)} to register ${hex(register)}`)
}
const loadRegisterToMemory = function (register, address) {
  console.log(`load value from register ${hex(register)} to address memory ${hex(address)}`)
}
const callGlobal = function(name) {
  console.log(`call for global '${name}' (expects to write result to register 0x0)`)
}

// Tree node types
const AssignmentExpression = function (operator, left, right) {
  assert(operator, '=')
  assert(left.type, 'Identifier')
  // do the right side and store the value on first register
  switch (right.type) {
    case 'Literal':
      loadFloatToRegister(right.value, 0x0)
      break
    case 'Identifier':
      let globalIndex = inArray(right.name, globalIds)
      let localIndex = inArray(right.name, localIds)
      if (globalIndex !== false) {
        // Load value from global id memory address and write it to the
        // first register
        let memoryAddress = getGlobalIdAddress(globalIndex)
        loadMemoryToRegister(memoryAddress, 0x0)
      } else if (localIndex !== false) {
        // Load value from local id memory address and write it to the
        // first register
        let memoryAddress = getLocalIdAddress(localIndex)
        loadMemoryToRegister(memoryAddress, 0x0)
      } else {
        throw new Error("This identifier can't be assigned.")
      }
      break
    case 'CallExpression':
      CallExpression(right.callee, right.arguments)
      break
  }

  let globalIndex = inArray(left.name, globalIds)
  let localIndex = inArray(left.name, localIds)
  if (globalIndex) {
    let memoryAddress = getGlobalIdAddress(globalIndex)
    loadRegisterToMemory(0x0, memoryAddress)
  } else if (localIndex) {
    let memoryAddress = getLocalIdAddress(localIndex)
    loadRegisterToMemory(0x0, memoryAddress)
  } else {
    // Add value to local ids and set the value to the memory address
    localIds.push(left.name)
    localIndex = inArray(left.name, localIds)
    let memoryAddress = getLocalIdAddress(localIndex)
    loadRegisterToMemory(0x0, memoryAddress)
  }
}

const CallExpression = function (callee, arguments) {
  // Load arguments to registers
  arguments.forEach(function (arg, i) {
    if (arg.type == 'Literal') {
      assert(typeof arg.value, 'number')
      loadFloatToRegister(arg.value, i)
    } else if (arg.type == 'Identifier') {
      let globalIndex = inArray(arg.name, globalIds)
      let localIndex = inArray(arg.name, localIds)
      if (globalIndex !== false) {
        let memoryAddress = getGlobalIdAddress(globalIndex)
        loadMemoryToRegister(memoryAddress, i)
      } else if (localIndex !== false) {
        let memoryAddress = getLocalIdAddress(localIndex)
        loadMemoryToRegister(memoryAddress, i)
      } else {
        throw new Error("This identifier can't be assigned.")
      }
    } else {
      throw new Error("Can't use argument.")
    }
  })
  // Assuming it will only call globals for now
  callGlobal(callee.name)
}

const processNode = (node) => {
  switch (node.type) {
    case "ExpressionStatement":
      let exp = node.expression
      if (exp.type == 'AssignmentExpression') {
        AssignmentExpression(exp.operator, exp.left, exp.right)
      } else if (exp.type == 'CallExpression') {
        CallExpression(exp.callee, exp.arguments)
      }
      break
    case "IfStatement":
      // TODO: Here I'll have to introduce a space to store subroutines
      break
  }
}


// This load the file and parse the sintax tree
const loadFile = async function (filename) {
  return await fs.readFile(filename, "utf8")
}
const getSyntaxTree = (codeString) => {
  return esprima.parseScript(codeString)
}


const main = async function () {
  const codeString = await loadFile('quirkbot_factory.js')
  // const codeString = await loadFile('simple_test.js')
  const ast = getSyntaxTree(codeString)

  console.log('======= PROCESSING NODES ===========')
  ast.body.forEach(processNode)

  console.log('=========== INTERNALS ===============')
  console.log('Local identifiers')
  localIds.forEach(function(localId, i) {
    console.log(` ${hex(getLocalIdAddress(i))}: '${localId}'`)
  })

  // Uncomment this to see the whole tree
  // console.log(JSON.stringify(ast, null, 2))
}

main()
