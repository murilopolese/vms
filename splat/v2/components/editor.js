const html = require('choo/html')
const ElementList = require('./elementlist.js')
const SymbolPicker = require('./symbolpicker.js')
const GivenPicker = require('./givenpicker.js')
const VotePicker = require('./votepicker.js')
const Rule = require('./rule.js')

function Editor(state, emit) {
  let elementIndex = state.elements.findIndex(el => el.name === state.editingElement)
  return html`
    <div id="editor">
      <div class="element-list">
        ${ElementList(state, emit)}
      </div>
      <div class="rules">
        ${state.elements[elementIndex].rules.map(
          (rule, ruleIndex) => Rule(elementIndex, ruleIndex, state, emit)
        )}
        <button class="add-rule" onclick=${() => emit('addRule')}>+</button>
      </div>
      <div class="element-picker">
        ${SymbolPicker(state, emit)}
      </div>
      <div class="element-picker">
        ${GivenPicker(state, emit)}
      </div>
      <div class="element-picker">
        ${VotePicker(state, emit)}
      </div>
    </div>
  `
}


module.exports = Editor
