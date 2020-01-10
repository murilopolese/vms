const esprima = require('esprima')

// This dictionary/hash maps variables to address memories
let variables = {
	'servo1': 0xF000, 'servo2': 0xF001, 'leftEye': 0xF002,
}
// Initial variable offset (this is used to calculate new variable addresses)
let nameOffset = 0x0
// Will return variable address. It generates an address if variable doesn't exist
function getVariableAddress(name) {
	if(variables[name] === undefined) {
		variables[name] = nameOffset
		nameOffset += 1
	}
	return variables[name]
}
// This dictionary/hash maps functions to address memories
let functions = {}
// Initial variable offset (this is used to calculate new variable addresses)
let functionOffset = 0x0
// Will return variable address. It generates an address if variable doesn't exist
function getFunctionAddress(name) {
	if(functions[name] === undefined) {
		functions[name] = functionOffset
		functionOffset += 1
	}
	return functions[name]
}

/**
 * Takes a string with a javascript program and makes it into a javascript
 * AST. This is mostly a proxy to esprima functionalities
 */
const parse = function(nodeOrScript) {
	if (typeof nodeOrScript === 'string') {
		return esprima.parse(nodeOrScript)
	} else if (typeof nodeOrScript === 'object') {
		return nodeOrScript
	}
}
/**
 * Takes a string with a javascript program, parses its abstract syntax tree
 * and make a recursive run through it transforming it into a string with
 * assembly instructions
 */
let assemble = function(content) {
	const node = parse(content)
	if (node == undefined) {
		return undefined
	}
	let fnName, fnParams
	switch(node.type) {
		case 'Program':
			return `(runInSequence\n${node.body.map(assemble).join(' \n')}\n)`

		// Primitives
		case 'Identifier':
			return `${node.name}`

		case 'Literal':
			return `${node.raw}`

		// Declarations
		case 'VariableDeclaration':
			return node.declarations.map(assemble).join('\n')

		case 'VariableDeclarator':
			return `(declareVar ${assemble(node.id)} ${assemble(node.init)})`

		case 'FunctionDeclaration':
			fnName = assemble(node.id)
			fnParams = node.params.map(assemble).join(' ')
			return `(declareFunc ${fnName} (${fnParams}) (${assemble(node.body)}))`

		// Expressions
		case 'BinaryExpression':
			return `(${node.operator} ${assemble(node.left)} ${assemble(node.right)})`

		case 'UnaryExpression':
			return `(${node.operator} ${assemble(node.argument)})`

		case 'UpdateExpression':
			return `(${node.operator} ${assemble(node.argument)})`

		case 'AssignmentExpression':
			return `(assign ${assemble(node.left)} ${assemble(node.right)})`

		case 'CallExpression':
			return `(${assemble(node.callee)} ${node.arguments.map(assemble).join(' ')})`

		// case 'MemberExpression':
		// 	return `${assemble(node.object)}.${assemble(node.property)}`

		case 'FunctionExpression':
			fnName = assemble(node.id)
			fnParams = node.params.map(assemble).join(' ')
			return `(declareFunc ${fnName} (${fnParams}) (${assemble(node.body)}))`
		// Statements
		case 'ExpressionStatement':
			return assemble(node.expression)

		case 'BlockStatement':
			return node.body.map(assemble).join('\n')

		case 'ForStatement':
			return `(for ${assemble(node.init)} ${assemble(node.test)} ${assemble(node.update)} ${assemble(node.body)})`

		case 'ReturnStatement':
			return assemble(node.argument)

		case 'IfStatement':
			return `(if ${assemble(node.test)} ${assemble(node.consequent)} ${assemble(node.alternate)})`

		default:
			return `${node.type}`
	}
}

module.exports = assemble
