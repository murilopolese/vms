// http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#Fx07

#include <stdio.h>

#define PROG_SIZE 4096

typedef unsigned int instruction;
typedef unsigned char number;
typedef unsigned int address;

unsigned long time;
unsigned char dt;
enum { false, true };
number running = false;

instruction program[PROG_SIZE]; // memory
number v[16]; // V (16 single byte registers)
address call_stack[16];

address p_pointer = -1; // PC
address m_pointer; // I
number cs_pointer;

void display() {
	printf("V00: %02x | V01: %02x | V02: %02x | V03: %02x \n", v[0], v[1], v[2], v[3]);
	printf("V04: %02x | V05: %02x | V06: %02x | V07: %02x \n", v[4], v[5], v[6], v[7]);
	printf("V08: %02x | V09: %02x | V10: %02x | V11: %02x \n", v[8], v[9], v[10], v[11]);
	printf("V12: %02x | V13: %02x | V14: %02x | V15: %02x \n", v[12], v[13], v[14], v[15]);
}

void parse_instruction() {
	p_pointer++;
	instruction instr = program[p_pointer];
	number op = (instr >> 12 & 0xF); // operation identifyier
	number v1 = instr >> 8 & 0x0F; // first register
	number v2 = instr >> 4 & 0x00F; // second register
	number value = instr & 0x00FF; // number value
	number addr = instr & 0x0FFF; // address
	unsigned int sum;
	switch(op) {
		case 0x0:
			switch(op & 0x00FF) {
				case 0xE0: // 00E0 - Clear the display.
					break;
				case 0xEE: // 00EE - Return from a subroutine.
					// Go to the address on top of call stack
					p_pointer = call_stack[cs_pointer];
					// "Pop" the call stack
					cs_pointer--;
					break;
			}
			break;
		case 0x1: // 1nnn - Jump to location nnn.
			p_pointer = addr;
			// Next `parse_instruction` will increment `p_pointer`
			p_pointer--;
			break;
		case 0x2: // 2nnn - Call subroutine at nnn.
			value = instr;
			cs_pointer++;
			call_stack[cs_pointer] = p_pointer;
			break;
		case 0x3: // 3xkk - Skip next instruction if Vx = kk.
			if (v[v1] == value) {
				p_pointer++;
			}
			break;
		case 0x4: // 4xkk - Skip next instruction if Vx != kk.
			if (v[v1] != value) {
				p_pointer++;
			}
			break;
		case 0x5: // 5xy0 - Skip next instruction if Vx = Vy.
			if (v[v1] == v[v2]) {
				p_pointer++;
			}
			break;
		case 0x6: // 6xkk - Set Vx = kk.
			printf("INSTRUCTION %04x\n V1 %x\n KK %02x\n", instr, v1, value);
			printf("%x\n", instr & 0x0F00);
			v[v1] = value;
			break;
		case 0x7: // 7xkk - Set Vx = Vx + kk.
			v[v1] += value;
			break;
		case 0x8:
			switch(instr & 0x000F) {
				case 0x0: // 8xy0 - Set Vx = Vy.
					v[v1] = v[v2];
					break;
				case 0x1: // 8xy1 - Set Vx = Vx OR Vy.
					v[v1] = v[v2] | v[v1];
					break;
				case 0x2: // 8xy2 - Set Vx = Vx AND Vy.
					v[v1] = v[v2] & v[v1];
					break;
				case 0x3: // 8xy3 - Set Vx = Vx XOR Vy.
					v[v1] = v[v2] ^ v[v1];
					break;
				case 0x4: // 8xy4 - Set Vx = Vx + Vy, set VF = carry.
					sum = v[v2] + v[v1];
					v[v1] = sum;
					if (sum > 0xFF) {
						v[15] = 1;
					} else {
						v[15] = 0;
					}
					break;
				case 0x5: // 8xy5 - Set Vx = Vx - Vy, set VF = NOT borrow.
					if (v[v1] > v[v2]) {
						v[15] = 1;
					} else {
						v[15] = 0;
					}
					v[v1] =  v[v1] - v[v2];
					break;
				case 0x6: // 8xy6 - Set Vx = Vx SHR 1.
					// SHR: Shift Right
					if (v[v1] & 0x0001 == 1) {
						v[15] = 1;
					} else {
						v[15] = 0;
					}
					v[v1] =  v[v1] / 2;
					break;
				case 0x7: // 8xy7 - Set Vx = Vy - Vx, set VF = NOT borrow.
					if (v[v2] > v[v1]) {
						v[15] = 1;
					} else {
						v[15] = 0;
					}
					v[v1] =  v[v2] - v[v1];
					break;
				case 0xE: // 8xyE - Set Vx = Vx SHL 1.
					// SHL: Shift left
					if (v[v1] >> 15 == 1) {
						v[15] = 1;
					} else {
						v[15] = 0;
					}
					v[v1] =  v[v1] * 2;
					break;
			}
			break;
		case 0x9: // 9xy0 - Skip next instruction if Vx != Vy.
			if (v[v1] != v[v2]) {
				p_pointer++;
			}
			break;
		case 0xA: // Annn - Set I = nnn.
			m_pointer = addr;
			break;
		case 0xB: // Bnnn - Jump to location nnn + V0.
			p_pointer = addr + v[0];
			break;
		case 0xC: // Cxkk - Set Vx = random byte AND kk.
			// TODO: generate random byte
			v[v1] = 0x23 & value;
			break;
		case 0xD: // Dxyn - Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
			display(value);
			break;
		case 0xE:
			switch (instr & 0x00FF) {
				case 0x009E: // Ex9E -  Skip next instruction if key with the value of Vx is pressed.
					break;
				case 0x00A1: // ExA1 -  Skip next instruction if key with the value of Vx is not pressed.
					break;
			}
			break;
		case 0xF:
			switch (instr & 0x00FF) {
				case 0x0000: // F000 - Halt.
					running = false;
					break;
				case 0x0007: // Fx07 - Set Vx = delay timer value.
					v[v1] = dt;
					break;
				case 0x000A: // Fx0A -  Wait for a key press, store the value of the key in Vx.
					break;
				case 0x0015: // Fx15 - Set delay timer = Vx.
					dt = v[v1];
					break;
				case 0x0018: // Fx18 - Set sound timer = Vx.
					break;
				case 0x001E: // Fx1E - Set I = I + Vx.
					m_pointer += v[v1];
					break;
				case 0x0029: // Fx29 -  Set I = location of sprite for digit Vx.
					break;
				case 0x0033: // Fx33 - Store BCD representation of Vx in memory locations I, I+1, and I+2.
					// binary-coded decimal
					// The interpreter takes the decimal value of Vx, and places
					// the hundreds digit in memory at location in I, the tens
					// digit at location I+1, and the ones digit at location I+2.
					program[m_pointer] = (v[v1] / 100);
					program[m_pointer+1] = (v[v1] / 10) % 10;
					program[m_pointer+2] = (v[v1]) % 10;
					break;
				case 0x0055: // Fx55 - Store registers V0 through Vx in memory starting at location I.
					for (number i = 0; i < v1; i++) {
						program[m_pointer + i] = v[i];
					}
					break;
				case 0x0065: // Fx65 - Read registers V0 through Vx in memory starting at location I.
					for (number i = 0; i < v1; i++) {
						v[i] = program[m_pointer + i];
					}
					break;
			}
			break;
	}

}

void load_program(instruction *p) {
	for (number i = 0; i < 100; i++) {
		program[i] = p[i];
	}
}

int main() {
	instruction example[PROG_SIZE] = {
		0x60FA, 0x61CA, 0x62DA,
		

		,0xF000
	};
	load_program(example);
	running = true;
	while (running) {
		parse_instruction();
	}
	display();
	return 0;
}
