// http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#Fx07
#define PROG_SIZE 256

typedef unsigned int instruction;
typedef unsigned char number;
typedef unsigned int address;
// typedef enum { false, true } bool;

unsigned long time = 0;
unsigned short dt = 1;
number running = false;

instruction memory[PROG_SIZE]; // memory
number v[16]; // V (16 single byte registers)
address call_stack[16];

address pc = -1; // PC
address mc; // I
number sp;

void print_log(String msg) {
	// Serial.print("LOG: ");
	// Serial.println(msg);
}

void parse_instruction() {
	pc++;
	instruction instr = memory[pc];
	number op = (instr >> 12 & 0xF); // operation identifyier
	number v1 = instr >> 8 & 0x0F; // first register
	number v2 = instr >> 4 & 0x00F; // second register
	number value = instr & 0x00FF; // number value
	number addr = instr & 0x0FFF; // address
	unsigned int sum;
	switch(op) {
		case 0x0:
			switch(value) {
				case 0x00: // 0000 - Do nothing.
					print_log("Do nothing");
					break;
				case 0xE0: // 00E0 - Clear the display.
					break;
				case 0xEE: // 00EE - Return from a subroutine.
					print_log("Return from a subroutine");
					// Go to the address on top of call stack
					pc = call_stack[sp];
					// "Pop" the call stack
					sp--;
					break;
			}
			break;
		case 0x1: // 1nnn - Jump to location nnn.
			print_log("Jump to location");
			pc = addr;
			break;
		case 0x2: // 2nnn - Call subroutine at nnn.
			print_log("Call subroutine");
			sp++;
			call_stack[sp] = pc;
			pc = addr;
			break;
		case 0x3: // 3xkk - Skip next instruction if Vx = kk.
			if (v[v1] == value) {
				pc++;
			}
			break;
		case 0x4: // 4xkk - Skip next instruction if Vx != kk.
			if (v[v1] != value) {
				pc++;
			}
			break;
		case 0x5: // 5xy0 - Skip next instruction if Vx = Vy.
			if (v[v1] == v[v2]) {
				pc++;
			}
			break;
		case 0x6: // 6xkk - Set Vx = kk.
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
				pc++;
			}
			break;
		case 0xA: // Annn - Set I = nnn.
			mc = addr;
			break;
		case 0xB: // Bnnn - Jump to location nnn + V0.
			pc = addr + v[0];
			break;
		case 0xC: // Cxkk - Set Vx = random byte AND kk.
			// TODO: generate random byte
			v[v1] = 0x23 & value;
			break;
		case 0xD: // Dxyn - Arduino stuff! <=================================
				switch(v1) {
					case 0x0: // D0kk - Write kk to PORTB
						DDRB = 0xFF;
						PORTB = value;
						break;
					case 0x1: // D1kk - Write kk to PORTC
						DDRC = 0xFF;
						PORTC = value;
						break;
					case 0x2: // D2kk - Write kk to PORTD
						DDRD |= B11111100;
						PORTD |= value & B11111100;
						break;
					case 0x3: // D3kk - Write kk to PORTF
						DDRF = 0xFF;
						PORTF = value;
						break;
				}
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
					mc += v[v1];
					break;
				case 0x0029: // Fx29 -  Set I = location of sprite for digit Vx.
					break;
				case 0x0033: // Fx33 - Store BCD representation of Vx in memory locations I, I+1, and I+2.
					// binary-coded decimal
					// The interpreter takes the decimal value of Vx, and places
					// the hundreds digit in memory at location in I, the tens
					// digit at location I+1, and the ones digit at location I+2.
					memory[mc] = (v[v1] / 100);
					memory[mc+1] = (v[v1] / 10) % 10;
					memory[mc+2] = (v[v1]) % 10;
					break;
				case 0x0055: // Fx55 - Store registers V0 through Vx in memory starting at location I.
					for (number i = 0; i < v1; i++) {
						memory[mc + i] = v[i];
					}
					break;
				case 0x0065: // Fx65 - Read registers V0 through Vx in memory starting at location I.
					for (number i = 0; i < v1; i++) {
						v[i] = memory[mc + i];
					}
					break;
			}
			break;
	}

}

void load_program(instruction *p) {
	for (number i = 0; i < 100; i++) {
		memory[i] = p[i];
	}
}

void setup() {
	running = true;
	Serial.begin(115200);
}

byte buffer[PROG_SIZE];
instruction i_buffer = 0;
unsigned short received;

void loop() {
	while (Serial.available() > 0) {
		mc = 0;
		pc = -1;
		sp = 0;
		running = true;

		received = Serial.readBytes(buffer, PROG_SIZE);
		Serial.print("Received ");
		Serial.println(received);
		Serial.print("Buffer ");
		for (int i = 0; i < PROG_SIZE; i+=2) {
			i_buffer = (buffer[i]<<8) | buffer[i+1];
			memory[mc] = i_buffer;
			Serial.print(i_buffer, HEX);
			Serial.print(" ");
			mc++;
		}
		Serial.println("");
	}

	if (running) {
		time++;
		if (time % dt == 0) {
			// Serial.println("-");
			// Serial.print("op: 0x");
			// Serial.println(memory[pc+1], HEX);
			// Serial.print("pc: ");
			// Serial.println(pc+1);
			parse_instruction();
		}
	}
}
