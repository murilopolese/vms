const html = require('choo/html')

function Rule(elementIndex, ruleIndex, state, emit) {
  const { when, then, symmetry } = state.elements[elementIndex].rules[ruleIndex]
  return html`
    <div class="rule" draggable="true">
      <div class="controls">
        <button onclick=${() => emit('moveRuleUp', elementIndex, ruleIndex)}>ˆ</button>
        <button onclick=${() => emit('nextSymmetry', elementIndex, ruleIndex, symmetry)}>${symmetry}</button>
        <button onclick=${() => emit('moveRuleDown', elementIndex, ruleIndex)} class="rotate">ˆ</button>
      </div>
      <div class="when">
        ${when.map((row, y) => {
          return html`
            <div>
              ${row.map((symbol, x) => {
                if (y == 1 && x == 1) {
                  return html`
                    <button>@</button>
                  `
                } else {
                  let onclick = () => emit('stampRule', 'when', ruleIndex, x, y)
                  return html`
                    <button onclick=${onclick}>${symbol}</button>
                  `
                }
              })}
            </div>
          `
        })}
      </div>
      <div> ${`=>`} </div>
      <div class="then">
        ${then.map((row, y) => {
          return html`
            <div>
              ${row.map((symbol, x) => {
                let onclick = () => emit('stampRule', 'then', ruleIndex, x, y)
                return html`
                  <button onclick=${onclick}>${symbol}</button>
                `
              })}
            </div>
          `
        })}
      </div>
    </div>
  `
}

module.exports = Rule
