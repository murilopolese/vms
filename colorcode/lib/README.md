# Color Code library

memory: Array of 4 bit values. 8x8 or 16x16, etc
rules: slots of 16 groups of 2 arrays with 9 items (3x3) for each of the 8 events
mode: EDIT, CODE or PLAY
cursor: position array with x and y coordinates [x, y]
selectedColor: 4 bit number
selectedEvent: 3 bit number
selectedSlot: 4 bit number

setTile(x, y)
eraseTile(x, y)
setMode(mode)
selectColor(colorIndex)
selectEvent(eventIndex)
selectedSlot(slotIndex)
setRule(x, y, whenOrThen)
eraseRule(x, y, whenOrThen)
setCursor(x, y)

applyRules(eventIndex)
