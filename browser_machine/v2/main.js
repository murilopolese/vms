const assembler = require('./lib/assembler.js')

let script = `
var a
var b = a * 2
c = b / 4
d = b / a
d = a++
myAss = --b
a = !c
b += a
for (var i = 0; i < 10; i++) {
	c = a + b + c
	if (c < d) {
		d *= 2
	} else {
		e = c
	}
}
function test(a, b, c, d) {
	return a * b + c - d
}
test(1, 2, 3, 4)
`
let result = assembler(script)
console.log(result)
