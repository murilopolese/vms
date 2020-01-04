var esprima = require('esprima')

/**
 * Takes a string with a javascript program, parses its abstract syntax tree
 * and make a recursive run through it transforming it into a string with
 * assembly instructions
 */
let assemble = function(contents) {
	let tree = esprima.parseScript(contents)
	if (node == undefined) {
		return ''
	}
	let fnName, fnParams
	switch(node.type) {
		case 'Program':
			return node.body.map(assemble).join('\n')

		// Primitives
		case 'Identifier':
			return `${node.name}`

		case 'Literal':
			return `${node.raw}`

		// Declarations
		case 'VariableDeclaration':
			return node.declarations.map(assemble).join('\n')

		case 'VariableDeclarator':
			return `var ${assemble(node.id)} = ${node.init ? assemble(node.init) : 0}`

		case 'FunctionDeclaration':
			fnName = assemble(node.id)
			fnParams = node.params.map(assemble).join(', ')
			return `function ${fnName}(${fnParams}) {\n${assemble(node.body)}\n}`

		// Expressions
		case 'BinaryExpression':
			return `${assemble(node.left)} ${node.operator} ${assemble(node.right)}`

		case 'UnaryExpression':
			if (node.prefix) {
				return `${node.operator}${assemble(node.argument)}`
			} else {
				return `${assemble(node.argument)}${node.operator}`
			}

		case 'UpdateExpression':
			if (node.prefix) {
				return `${node.operator}${assemble(node.argument)}`
			} else {
				return `${assemble(node.argument)}${node.operator}`
			}

		case 'AssignmentExpression':
			return `${assemble(node.left)} ${node.operator} ${assemble(node.right)}`

		case 'CallExpression':
			return `${assemble(node.callee)}(${node.arguments.map(assemble).join(', ')})`

		case 'MemberExpression':
			return `${assemble(node.object)}.${assemble(node.property)}`

		case 'FunctionExpression':
			fnName = assemble(node.id)
			fnParams = node.params.map(assemble).join(', ')
			return `function ${fnName}(${fnParams}) {\n${assemble(node.body)}\n}`

		// Statements
		case 'ExpressionStatement':
			return `${assemble(node.expression)}`

		case 'BlockStatement':
			return node.body.map(assemble).join('\n')

		case 'ForStatement':
			return `for (${assemble(node.init)}; ${assemble(node.test)}; ${assemble(node.update)}) {\n${assemble(node.body)}\n}`

		case 'ReturnStatement':
			return `return ${assemble(node.argument)}`

		case 'IfStatement':
			return `if (${assemble(node.test)}) {\n${assemble(node.consequent)}\n} else {${node.alternate ? assemble(node.alternate) : ''}\n}`

		default:
			return `${node.type}`
	}
}

module.exports = assemble
