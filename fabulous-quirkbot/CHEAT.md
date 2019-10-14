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
0x92XY Sets register X = Y
0x93XY Sets register X = X | Y
0x94XY Sets register X = X & Y
0x95XY Sets register X = X ^ Y
0x96XY Sets register X = X + Y
0x97XY Sets register X = X - Y
0xA0XY Skip next instruction if register X == Y
0xA1XY Skip next instruction if register X != Y
0xA2XY Skip next instruction if register X < Y
0xA3XY Skip next instruction if register X > Y
```
