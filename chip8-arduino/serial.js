// Use a hex editor if you want to program like this, seriously
let msg = Buffer.from([
	0x00, 0x00, // Beginning
	0x20, 0x05, // Call all lights on
	0x20, 0x0B, // Call all lights off
	0x10, 0x00, // Go to the beginning
	0xF0, 0x00, // Halt

	0x00, 0x00, // All lights on
	0xD0, 0xFF,
	0xD1, 0xFF,
	0xD2, 0xFF,
	0xD3, 0xFF,
	0x00, 0xEE, // RETURN

	0x00, 0x00, // All lights off
	0xD0, 0x00,
	0xD1, 0x00,
	0xD2, 0x00,
	0xD3, 0x00,
	0x00, 0xEE, // RETURN
])

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

let port = new SerialPort('/dev/ttyACM0')

port.write(msg)

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', console.log)
