const esprima = require('esprima')

/**
 * Takes a string with a javascript program and makes it into a javascript
 * AST. This is mostly a proxy to esprima functionalities
 */
const parseAny = function(nodeOrScript) {
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
let parse = function(content) {
	const node = parseAny(content)
	if (node == undefined) {
		return undefined
	}
	let fnName, fnParams
	switch(node.type) {
		case 'Program':
			return `(runInSequence\n${node.body.map(parse).join(' \n')}\n)`

		// Primitives
		case 'Identifier':
			return `${node.name}`

		case 'Literal':
			return `${node.raw}`

		// Declarations
		case 'VariableDeclaration':
			return node.declarations.map(parse).join('\n')

		case 'VariableDeclarator':
			return `(declareVar ${parse(node.id)} ${parse(node.init)})`

		case 'FunctionDeclaration':
			fnName = parse(node.id)
			fnParams = node.params.map(parse).join(' ')
			return `(declareFunc ${fnName} (${fnParams}) (${parse(node.body)}))`

		// Expressions
		case 'BinaryExpression':
			return `(${node.operator} ${parse(node.left)} ${parse(node.right)})`

		case 'UnaryExpression':
			return `(${node.operator} ${parse(node.argument)})`

		case 'UpdateExpression':
			return `(${node.operator} ${parse(node.argument)})`

		case 'AssignmentExpression':
			return `(assign ${parse(node.left)} ${parse(node.right)})`

		case 'CallExpression':
			return `(${parse(node.callee)} ${node.arguments.map(parse).join(' ')})`

		// case 'MemberExpression':
		// 	return `${parse(node.object)}.${parse(node.property)}`

		case 'FunctionExpression':
			fnName = parse(node.id)
			fnParams = node.params.map(parse).join(' ')
			return `(declareFunc ${fnName} (${fnParams}) (${parse(node.body)}))`
		// Statements
		case 'ExpressionStatement':
			return parse(node.expression)

		case 'BlockStatement':
			return node.body.map(parse).join('\n')

		case 'ForStatement':
			return `(for ${parse(node.init)} ${parse(node.test)} ${parse(node.update)} ${parse(node.body)})`

		case 'ReturnStatement':
			return parse(node.argument)

		case 'IfStatement':
			return `(if ${parse(node.test)} ${parse(node.consequent)} ${parse(node.alternate)})`

		case 'WhileStatement':
			return `(while ${parse(node.test)} ${parse(node.body)})`

		default:
			return `${node.type}`
	}
}

module.exports = parse
