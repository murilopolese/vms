# Fabulous Virtual Machine

Generic a very simple yet fabulous portable bytecode VM (Virtual Machines) written in C.

It has a memory space that stores both instructions for programs and numbers to be used by the program or an external process. The program pointer stores which address should the VM execute as an instruction and the memory pointer stores which address to read or write from the memory.

It also has a call stack to store addresses so the program knows where to return from a subroutine call.

It has 16 registers, numbered from 0x0 to 0xF. The 0xF is also used as a Flag register that will be set to 0x1 or 0x0 depending on the operation executed.

The VM operations are stored in arrays of function pointers for ease to use. There are 3 families of operations: "Core", register and conditional jumps operations, but you shouldn't worry about that unless you want to change the bytecodes.

An instruction contains 16 bits, which is represented as sixteen ones or zeros in a row: `B0000000000000000` but because we are not machines, we can also represent hexadecimal value with 4 digits. For example: `0xABCD`. This is possible because each digit can be 16 different values from zero to F (`0`, `1`, ... `9`, `A`, `B` ... `F`). In binary, to count until 16 you need 4 digits, while you can do it with 1 in hexadecimal!

It does make it a little harder to shift the values back and forth as you will always have to multiply the bits by 4, but overall it makes things much more readable and easy to remember with hexadecimal format.

Taking the example `0xABCD` as an example, The "first" digit `A` would represent which core operation to execute. The other three digits `BCD` are the operand.

The Virtual Machine comes with the minimum amount of instructions covering only interger math, binary logic and code control. It has plenty room for implementing aditional code but as it is it already can do a whole lot of things.

The instructions that come built in are:

```
0x1000 Halt
0x2000 Return from subroutine
0x3nnn Set program pointer to address nnn
0x4nnn Call subroutine at address nnn
0x5nnn Set memory pointer to address nnn
0x6Xkk Load the value kk to register x
0x7Xkk Add value kk to register x, set register 0xF to 0x01 if result is bigger than 255
0x8Xkk Subtract value kk from register x, set register 0xF to 0x01 if result is smaller than 0
0x90X0 Load register x to memory at the memory pointer
0x91X0 Load the value on the memory at the memory pointer to register x
0x92XY Sets register Y = X
0x93XY Sets register Y = Y | X
0x94XY Sets register Y = Y & X
0x95XY Sets register Y = Y ^ X
0xA0XY Skip next instruction if register X == Y
0xA1XY Skip next instruction if register X != Y
0xA2XY Skip next instruction if register X < Y
0xA3XY Skip next instruction if register X > Y
```

The Virtual Machine can run specific instructions given to the function `execute_instruction(uint16_t)` or by calling `execute_next_instruction()` until the flag `running` is set to false. One can be useful to create an interactive prompt, the other to run the program that is currently loaded on the memory.
