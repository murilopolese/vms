function BrainFlux(code) {
  this.loadProgram = function(code) {
    code = code.replace(' ', '') // remove whitespaces
    code = code.replace('\n', '') // remove line breaks
    code = code.replace('\r', '') // remove line breaks
    return code.split('')
  }

  this.step = function() {
    let instruction = this.program[this.programPointer]
    // console.log('memory, memoryPointer, program, programPointer')
    // console.log(memory, memoryPointer, program, programPointer)
    switch (instruction) {
      case '+':
        this.memory[this.memoryPointer] += 1
        this.memory[this.memoryPointer] %= 256
        break
      case '-':
        this.memory[this.memoryPointer] = (this.memory[this.memoryPointer]-1) + 256
        this.memory[this.memoryPointer] %= 256
        break
      case '>':
        this.memoryPointer = (this.memoryPointer+1) % this.memory.length
        break
      case '<':
        this.memoryPointer = (this.memoryPointer-1) + this.memory.length
        this.memoryPointer %= this.memory.length
        break
      case '[':
        if (this.memory[this.memoryPointer] === 0) {
          // Skip to next matching `]`
          let count = 1
          let match = false
          while (!match) {
            this.programPointer += 1
            this.programPointer %= this.program.length
            let next = this.program[this.programPointer]
            if (next === '[') {
              count += 1
            } else if (next === ']' && count > 0) {
              count -= 1
            }
            match = next === ']' && count == 0
          }
        } else {
          // Push program pointer to stack
          this.stack.push(this.programPointer)
        }
        break;
      case ']':
        // go to position on stack
        this.programPointer = this.stack.pop()
        this.programPointer -= 1
        break
      case '@':
        this.programPointer = this.memory[this.memoryPointer]
        this.programPointer -= 1
      default:
        break;
    }
    this.programPointer += 1
    if (this.programPointer > this.program.length) {
      throw new Error('Halt')
    }
  }

  this.program = this.loadProgram(code)
  this.programPointer = 0
  this.memory = []
  for (let i = 0; i < 16; i++) {
    this.memory.push(0)
  }
  this.memoryPointer = 0

  this.stack = []
}
