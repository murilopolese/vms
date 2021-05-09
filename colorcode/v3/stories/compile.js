const fs = require('fs')

const names = fs.readdirSync('./')
  .filter(file => file.indexOf('.json') !== -1)
  .map((file) => {
    return file.split('.')[0]
  })
names.forEach((name) => {
  const json = require(`./${name}.json`)
  let tape = []

  let i = 0
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      tape[i] = json.tileMap[x][y]
      i += 1
    }
  }

  for (let e = 0; e < 1; e++) {
    for (let r = 0; r < 16; r++) {
      // WHEN
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          tape[i] = json.rules[e][r][0][x][y]
          i += 1
        }
      }
      // THEN
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          tape[i] = json.rules[e][r][1][x][y]
          i += 1
        }
      }
    }
  }

  tape = tape.map(t => t===null?'null':t)

  fs.writeFileSync(`${name}_compiled`, tape.toString())
})
