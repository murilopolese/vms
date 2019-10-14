const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')


function init() {
	let port = new SerialPort('/dev/ttyACM0')
	const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
	parser.on('data', console.log)
	return port
}

module.exports = {
	init
}
