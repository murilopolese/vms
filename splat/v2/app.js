const choo = require('choo')
const html = require('choo/html')

const store = require('./store.js')

const colors = require('./components/colors.js')
const Grid = require('./components/grid.js')
const Editor = require('./components/editor.js')
const FileInput = require('./components/fileinput.js')

const app = choo()

app.use(store)

app.route('/', Layout)

app.mount('#app')

function Layout(state, emit) {
  return html`
    <div id="app">
      ${Grid(state, emit)}
      ${Editor(state, emit)}
      ${FileInput(state, emit)}
    </div>
  `
}
