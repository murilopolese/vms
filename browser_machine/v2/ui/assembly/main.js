const vm = require('../../lib/vm')
const assembleInstruction = require('../../lib/assembler')

const bin = function(n, size) {
	let b = (n>>>0).toString(2)
	for (let i = b.length; i < size; i++) {
		b = `0${b}`
	}
	return b
}
const int = function(b) {
	let n = 0
	for (let i = 0; i < b.length; i++) {
		n = n << 1
		if (b[i] == 1) {
			n |= 0b1
		}
	}
	return n
}

window.compile = function() {
	let textarea = document.getElementById('screen')
	let printer = document.getElementById('printer')
	let code = textarea.value.split(`\n`)
	code.unshift('noop')
	console.log(code.join(' '))
	code = code.map((line) => assembleInstruction(line))
	console.log(code.map(n => bin(n, 16)).join(' '))
	code = code.map((line) => `0x${line.toString(16)}`)
	console.log(code.join(' '))

	printer.innerText = 'HEX Output: \n'
	code.forEach((line, i) => {
		printer.innerHTML += line
		printer.innerHTML += ` `
	})
}
