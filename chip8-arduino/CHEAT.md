```
00E0 - Clear the display.
00EE - Return from a subroutine.
1nnn - Jump to location nnn.
2nnn - Call subroutine at nnn.
3xkk - Skip next instruction if Vx = kk.
4xkk - Skip next instruction if Vx != kk.
5xy0 - Skip next instruction if Vx = Vy.
6xkk - Set Vx = kk.
7xkk - Set Vx = Vx + kk.
8xy0 - Set Vx = Vy.
8xy1 - Set Vx = Vx OR Vy.
8xy2 - Set Vx = Vx AND Vy.
8xy3 - Set Vx = Vx XOR Vy.
8xy4 - Set Vx = Vx + Vy, set VF = carry.
8xy5 - Set Vx = Vx - Vy, set VF = NOT borrow.
8xy6 - Set Vx = Vx SHR 1.
8xy7 - Set Vx = Vy - Vx, set VF = NOT borrow.
8xyE - Set Vx = Vx SHL 1.
9xy0 - Skip next instruction if Vx != Vy.
Annn - Set I = nnn.
Bnnn - Jump to location nnn + V0.
Cxkk - Set Vx = random byte AND kk.

// ARDUINO STUFF
D0kk - Write kk to PORTB
D1kk - Write kk to PORTC
D2kk - Write kk to PORTD
D3kk - Write kk to PORTF

F000 - Halt.
Fx07 - Set Vx = delay timer value.
Fx0A - Wait for a key press, store the value of the key in Vx.
Fx15 - Set delay timer = Vx.
Fx18 - Set sound timer = Vx.
Fx1E - Set I = I + Vx.
Fx29 -  Set I = location of sprite for digit Vx.
Fx33 - Store BCD representation of Vx in memory locations I, I+1, and I+2.

// THIS IS THE OFFICIAL CHIP-8
Fx55 - Store registers V0 through Vx in memory starting at location I.
Fx65 - Read registers V0 through Vx in memory starting at location I.
// THIS IS MY VERSION
Fx55 - Store register Vx in memory at location I.
Fx65 - Read register Vx from value in memory at location I.


Ex9E - Skip next instruction if key with the value of Vx is pressed.
ExA1 - Skip next instruction if key with the value of Vx is not pressed.
```
