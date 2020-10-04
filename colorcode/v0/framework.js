function isPlainObject(value) {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
}
function h (tag, attrs, ...children) {
	const el = document.createElement(tag)
	if (isPlainObject(attrs)) {
		for (let k in attrs) {
			if (typeof attrs[k] === 'function') el.addEventListener(k, attrs[k])
			else el.setAttribute(k, attrs[k])
		}
	} else if (attrs) {
		children = [attrs].concat(children)
	}
	for (let child of children) el.append(child)
	return el
}
function render(query, el) {
	let target = document.querySelector(query)
	target.innerHTML = ''
	if (el instanceof Array) {
		for (e in el) {
			target.appendChild(el[e])
		}
	} else {
		target.appendChild(el)
	}
}

function EventEmitter() {
	this.e = new EventTarget()
}

let emitter = new EventTarget()

function on(eventName, callback) {
	let cb = function(e) {
		callback(e.detail)
	}
	emitter.addEventListener(eventName, cb)
}

function emit(eventName, ...args) {
	let event = new CustomEvent(eventName, { detail: args });
	emitter.dispatchEvent(event)
}
