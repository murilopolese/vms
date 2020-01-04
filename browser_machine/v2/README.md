# Browser VM for HMMM

This is a browser based ecosystem for the [HMMM](https://www.cs.hmc.edu/~cs5grad/cs5/hmmm/documentation/documentation.html) assembly instruction set.

The goal of this project is to have:

- An *assembler* that takes high level programming languages and turn it into HMMM instructions.
- A *compiler* that takes ASCII assembly instructions and transform it into bytecode
- A *bytecode interpreter* or *virtual machine* that takes bytecode as an `ArrayBuffer` and execute it altering another sections of the `ArrayBuffer` representing registers, memory, etc...

They might have different implementations targeting browser, C and even assembly if I'm strong enough.

## Seriously, why?

I would love to have the experience of programming with interpreted languages on tiny microprocessors such as the "Arduino" ATMEL chips. They are mostly 8 bit architectures with very little RAM available.

Most implementations of interpreted languages for those microprocessors (BASIC, Lisp, forth, even python with snek) are very opinionated and advanced to me. I'm not able to grasp its complexity and conventions and although the demo worked, I wasn't able to adapt it to my own needs.

Also, learning those languages might be like learning latin, very interesting and all, you get to understand beautiful details about the nature of programs but one can only appreciate it when looking back in perspective, nobody I know learned latin on kindergarten.

On the journey to understand those projects I figured out this shouldn't be so hard given that I do not aim for an optimal performance, this is an educational, experience focused project.

Most implementation have a serial interface where you can type your code. While this is great I will choose to do the compilation part outside of the board and transmit only the bytecode.

## How it works?

### Main pipeline

1. Take a high level language and turn it into assembly.
2. Take assembly instructions and turn it into bytecode.
3. Send bytecode to board.
4. Send message to board to execute bytecode altering the "tape"/memory.

### User story 1:

- User writes high level language on the browser
- Main Pipeline

### User story 2:

- User creates a program using Microsoft MakeCode
- MakeCode generates Javascript
- Main Pipeline

### User story 3:

- User creates a program using Scratch, Blockly or Flow interfaces
- Interfaces provide an Abstract Syntax Tree (AST)
- Code generators output high level language from AST
- Main Pipeline
