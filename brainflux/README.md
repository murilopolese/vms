# Brainflux

Brainflux is a port from another foul mouth esoteric programming language. Brainflux on the other hand doesn't want that. Once you give brainflux consent it will massage your brain and put you in a flow state.

```
[0][0][0] .... [0] (tape)
    ^ (memory pointer)

++++++[>+++++++<-] (instruction)
^ (instruction pointer)
```

This is your tape. Each cell is an 8 bit/1 byte number. It can store a number from 0 to 255, an ASCII character or 8 "flags".

1. You can write on it with: `-` and `+`
1. You can move the memory pointer left and right with: `<` and `>`
1. You can write loops with: `[` and `]`. It only enters/reenters the loop if value at memory pointer is not `0`.
1. You can move the instruction pointer to the value at memory pointer with `@`
