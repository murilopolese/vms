const parse = require('./lib/parser.js')

// let script = `
// var a
// var b = a * 2
// c = b / 4
// d = b / a
// d = a++
// myAss = --b
// a = !c
// b += a
// for (var i = 0; i < 10; i++) {
// 	c = a + b + c
// 	if (c < d) {
// 		d *= 2
// 	} else {
// 		e = c
// 	}
// }
// function test(a, b, c, d) {
// 	return a * b + c - d
// }
// test(1, 2, 3, 4)
// `

let script = `
let a = 0
while (true) {
	for (let i = 0; i < 8; i++) {
		a = a * 2
	}
	for (let i = 0; i < 8; i++) {
		a = a / 2
	}
}
`
let result = parse(script)
console.log(result)
