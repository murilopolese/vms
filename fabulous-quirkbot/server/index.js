const qb = require('./libs/quirkbot.js')
const serial = require('./libs/serial.js')
const port = serial.init()

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

let debounce = null;

io.on('connection', client => {
	console.log('client connected')
	client.on('event', function(data) {
		console.log('event', data.map(i => i.toString(16)))
		if (debounce == null) {
			clearTimeout(debounce)
		}
		debounce = setTimeout(function() {
			port.write(Buffer.from(data))
			debounce = null
		}, 250)
	});
	client.on('disconnect', () => {
		console.log('client disconnected')
	});
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})

server.listen(3000);
