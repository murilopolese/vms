# CHIP-8 on Arduino

Following on the CHIP-8 studies, this is the main `switch` running on an arduino, more specifically [Quirkbot](https://quirkbot.com).

It can load bytecode from serial to the memory and execute on the fly. I am actually very impressed and excited as I'm writing this hehe.

There is a Nodejs script that can send the stream of bytecodes to the serial port, a `CHEAT.md` to "help" and the rest is the pain of having to write code in machine language. It's a very sadistic puzzle if you are interested in those sort of things. I love it :)

The only extra feature added to CHIP-8 were GPIO operations under of type `0xDxkk` that writes the number `kk` (an 8 bit integer) to the port of index `x` defined arbitrarily. The available ports are `PORTB`, `PORTC`, `PORTD` and `PORTF`.

For example this code will turn all the lights on, then off and repeat, using subroutines:

```
0x0000, // Beginning
0x2005, // Call all lights on
0x200B, // Call all lights off
0x1000, // Go to the beginning
0xF000, // Halt

0x0000, // All lights on
0xD0FF,
0xD1FF,
0xD2FF,
0xD3FF,
0x00EE, // RETURN

0x0000, // All lights off
0xD000,
0xD100,
0xD200,
0xD300,
0x00EE
```

The sleep function can be used by changing the delay timer and can create PWM and blinking with many speeds.
