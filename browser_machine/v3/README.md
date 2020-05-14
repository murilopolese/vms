# Pocket Virtual Machine

This is a home baked, hand made, artisanal virtual machine written in javascript in a way that could be easily bootstraped and implemented in other languages.

It's a virtual machine that manipulates values in in 3 different types of memory: program, registers and memory.

The program holds words that represent actions to be executed by the machine.

The register is where we store temporary values for complex math and logical operations.

The memory is where we store data we want to store, output or input data.

The memory is divided in cells called "words". Each word is 16 bits (2 bytes) long. Each bit can be a `0` or a `1`:

```
|----------------|----------------|
|     word       |     word       | ... memory
 0111011000110010 0111011000110010
```

This is also called the *base 2*, the binary representation of a number. Other bases are possible such as *base 10* (decimal) e *base 16* (hexadecimal).

For this manual we'll use the hexadecimal representation of those words, prefixing it with `0x` to make it explicit for the reader it's an hexadecimal number (this is a javascript thing).

```
|------|------|
| word | word | ... memory
 0xA02C 0x102E
```

## Word formats

Words that are stored on program memory are called instructions because they are encoded instructions for the machine to perform an operation.

We call each character of the hexadecimal format of the word a *nibble*. Two characters are a *byte* or *8 bits* and we call it a *number*.

The first nibble of an instruction is the *operator*. The operator of the instruction `0xF000` is `F`. There are 16 possible operators.

The three last nibbles of an instruction are the *operand*. For example the operand of `0xFEDC` is `EDC`.

The operand cand be a combination between 3 nibbles each representing a register related with the operation.

Sometimes operations only need one nibble, sometimes only a number, sometimes a mix of them. The common pattern found in the operations is:

```
0x operator register register register
0x operator register register |   0  |
0x operator register |   0  | |   0  |
0x operator register | --- number -- |
0x operator |   0  | | --- number -- |
```

| pseudo assembly | Instruction  | Description                       |
| ----------------|:------------:|----------------------------------:|
| setReg R NN     | 0x1RNN       | R = NN                            |
| loadReg R NN    | 0x2RNN       | R = MEMORY[NN]                    |
| store R NN      | 0x3RNN       | MEMORY[NN] = R                    |
| add R1 R2 R3    | 0x4R1R2R3    | R1 = R2 + R3                      |
| sub R1 R2 R3    | 0x5R1R2R3    | R1 = R2 - R3                      |
| and R1 R2 R3    | 0x6R1R2R3    | R1 = R2 & R3                      |
| or R1 R2 R3     | 0x7R1R2R3    | `R1 = R2 | R3`                    |
| xor R1 R2 R3    | 0x8R1R2R3    | R1 = R2 ^ R3                      |
| not R           | 0x9R00       | R1 = ~ R1                         |
| jump NN         | 0xA0NN       | Set program pointer to NN         |
| jumpless R1 R2  | 0xBR1R20     | Jump next instr. if R1 < R2       |
| jumpgreat R1 R2 | 0xCR1R20     | Jump next instr. if R1 > R2       |
| jumpeq R1 R2    | 0xDR1R20     | Jump next instr. if R1 == R2      |
| noop            | 0x000000     | Do Nothing                        |
| noop            | 0xE00000     | Do Nothing                        |
| halt            | 0xFFFFFF     | Stop machine execution            |

## Interface

The display shows all memory addresses. There are 16 buttons for each possible nibble value from `0` to `F`.

There is a run button (`RN`) and a stop button (`STP`) to control the machine internal execution runtime. When running, the program pointer will loop only over the program memory.

There are two buttons `o` and `x` that move the program pointer forward and backwards through the memory.

The program pointer is always highlighted on the screen. Whenever you want to override a value, move the progam pointer to the cell on the tape and type in the desired value.

## Example

There is a program called "chaser", known to be the "hello world" of assembly. It modify the value of a value in memory to make it look like there is a `1` bouncing back and forth.

```
Program
0x0000 0x3000 0x3100 0x3200 0x3300 0x3200 0x3100 0xA000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000 0x0000
Registers
0x1000 0x0100 0x0010 0x0001 0x0000 0x0000 0x0000 0x0000
```
