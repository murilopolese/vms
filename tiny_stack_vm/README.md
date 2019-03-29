# Tiny Stack VM

This is the first ever VM I made. It's a stack based contraption that can load and execute a set of instruction. The idea is to put this VM inside ATMEL microprocessors, specially the 8 bit family, more specifically the `atmega32u4`, which is the board powering [Quirkbot](http://www.quirkbot.com).

The main goal behind that is to have a interactive runtime where instructions can be executed on the go by the microprocessor without having to compile C++ for it.

## How I think it will work

There will be a visual programming environment that will generate a representation of the code structure (tree) that will generate a list of instructions to be assembled into a binary file (easier said than done). I'm expecting this to happen in the browser first. Eventually this could live inside the microprocessor itself. It would be awesome to write it in a language that could be compiled to WebAssembly.

This binary will be fed into a runtime that will decode and execute this instructions. I'm expecting this to live inside the microprocessor.

The binary file will be fed to the runtime on the board through USB serial. Inside the board there will be other small programs for complex mathematical operations, IO and software PWM which will communicate with the VM through registers.

## Instructions

Instructions are composed of 2 parts: `type` and `value`.

```
0x  0     00
   type  value
```

If type is `0`, it will push the value to the stack. Because of this, all the numbers are 8 bits (0 - 255).

If type is `1` it will use the value to match end execute a "core function", refered as "primitive" on the source code.

### Instructions

- `HALT`: Stop execution.
- `DUP`: Duplicate the number on top of the stack.
- `POP`: Remove the number top of the stack.
- `ADD`, `SUB`, `MUL`, `DIV`, `MOD`: Add, subtract, multiply, divide and perform the modulo operator on the number before the top of the stack by the number on top of the stack. This will pop the two numbers and place the result.
- `AND`: Check if last two items on top of the stack are `true`, pop the two items and push `true` or `false` to the stack.
- `OR`:  Check if one of the two items on top of the stack are `true`, pop the two items and push `true` or `false` to the stack.
- `NOT`: Flip the value from the top of the stack from `false` to `true` or anything else to `false`.
- `EQ`, `LT`, `GT`: Check if the number before the top of the stack is equal, lower than and greater than the number on top of the stack, pop the two numbers and push `true` or `false` to the stack.
- `IF`, `ELSE`, `ENDIF`: Define 2 blocks of code, the first one declared between `IF` and `ELSE` and the second one between `ELSE` and `ENDIF`. The second block is optional, in this case, block will be defined. between `IF` and `ENDIF`. If top of the stack is positive, first block will be executed skipping the second, otherwise the first block will be skipped and if there is a second block, it will be executed.

#### Example

```
2 3 LT
4 DUP EQ
AND
IF
	1 2
ELSE
	4 3
ENDIF
ADD
HALT
```

#### TODO:

- `BAND`, `BOR`, `BLEFT`, `BRIGHT`
- `GOTO`, `GOSUB`, `RETURN`
- `WHILE`, `ENDWHILE`

Arduino specific:
- `PORTA`, `PORTB`, `PORTC`, `PORTD`, `READ`, `WRITE`
- `HORN`, `LARM`, `RARM`, `LLEG`, `RLEG`, `LEYE`, `REYE`, etc
- `DELAY`, `PWM`, `KEYPRESS`, `CTOUCH`

## Building

`gcc main.c -o out`
