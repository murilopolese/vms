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

module.exports = {
	log,
	hex,
	padHex,
	indexOf,
	map
	flatten,
	concat
}
