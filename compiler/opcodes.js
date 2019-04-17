function returnFromSubroutine() {
	return `00EE`
}
function jumpTo(address) {
	return `1${address}`
}
function callSubroutineAt(address) {
	return `2${address}`
}
function skipIfRegisterEqualsValue(register, value) {
	return `3${register}${value}`
}
function skipIfRegisterNotEqualsValue(register, value) {
	return `4${register}${value}`
}
function skipIfRegisterEqualsRegister(reg1, reg2) {
	return `5${register}${value}`
}
function skipIfRegisterNotEqualsRegister(reg1, reg2) {
	return `9${register}${value}`
}
function loadValueToRegister(value, register) {
	return `6${register}${value}`
}
function loadRegisterToRegister(reg1, reg2) {
	return `8${register}${value}0`
}
function incrementValueToRegister(value, register) {
	return `7${register}${value}`
}
function registerOrRegister(reg1, reg2) {
	return `8${register}${value}1`
}
function registerAndRegister(reg1, reg2) {
	return `8${register}${value}2`
}
function registerXorRegister(reg1, reg2) {
	return `8${register}${value}3`
}
function addRegisters(reg1, reg2) {
	return `8${register}${value}4`
}
function subtractRegisters(reg1, reg2) {
	return `8${register}${value}5`
}
function shiftRegisterRight(reg) {
	return `8${register}${value}6`
}
function shiftRegisterLeft(reg) {
	return `8${register}${value}E`
}
function setMemoryPointerTo(address) {
	return `A${address}`
}
function loadRandomToRegister(mask, register) {
	return `C${register}${mask}`
}
function halt() {
	return `F000`
}
function loadRegisterToDelayTimer(register) {
	return `F${register}07`
}
function storeRegisterToMemory(register, address) {
	return `F${register}55`
}
function loadMemoryToRegister(address, register) {
	return `F${register}65`
}

module.exports = {
	returnFromSubroutine,
	jumpTo,
	callSubroutineAt,
	skipIfRegisterEqualsValue,
	skipIfRegisterNotEqualsValue,
	skipIfRegisterEqualsRegister,
	skipIfRegisterNotEqualsRegister,
	loadValueToRegister,
	loadRegisterToRegister,
	incrementValueToRegister,
	registerOrRegister,
	registerAndRegister,
	registerXorRegister,
	addRegisters,
	subtractRegisters,
	shiftRegisterRight,
	shiftRegisterLeft,
	setMemoryPointerTo,
	loadRandomToRegister,
	halt,
	loadRegisterToDelayTimer,
	storeRegisterToMemory,
	loadMemoryToRegister
}
