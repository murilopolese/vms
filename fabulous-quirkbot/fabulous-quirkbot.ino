#include <stdint.h>

#define MEM_SIZE 256 // Total memory size
#define CALL_STACK_SIZE 16 // How many nested calls can the VM make

// VM TYPES DEFINITIONS
//typedef enum { false, true } bool;
typedef uint16_t instruction;
typedef uint16_t operand; // 12 bits
typedef void (*operation)(operand);
typedef uint16_t address; // 12 bits
typedef uint8_t number;
typedef uint8_t nibble; // 4 bits

// VM STATES
// Flags if program is currently running
bool running = false;
// Total amount of memory the VM has access to. Because the type address is
// 12 bits long, the maximum size is 4096
instruction memory[MEM_SIZE];
// Registers ids are 1 nibble long from 0x0 to 0xF
number registers[16];
// call stack will keep address so program knows where to return
address cs[CALL_STACK_SIZE];
// call stack pointer will point to the "top" of the stack. The "top" is always
// pointing to the position above the last item on the stack. For example if
// there are 2 items on the stack (cs[0] and cs[1]), the `cp` will be 2.
nibble cp;

// The program pointer indicates what is the address on the memory that should
// be executed by the VM as an instruction. This value will be incremented
// before running the next instruction.
address pp;
// The memory pointer indicates a memory address to load or read values.
address mp;

// FUNCTION POINTERS
// Array of function pointers for "core operations"
operation op[16];
// Array of function pointers for "register operations"
operation regi_op[16];
// Array of function pointers for "conditional jumps"
operation jumpif_op[16];

// CALL STACK OPERATIONS
void push_address(address addr) {
	cs[cp++] = addr;
}

address pop_address() {
	cp -= 1;
	return cs[cp];
}

// NO ARGUMENT OPERATIONS
void do_nothing(operand o) {
	// as it says
}

void halt(operand o) {
	running = false;
}

void return_call(operand o) {
	pp = pop_address();
}

// ADDRESS OPERATIONS
void jump_to(operand o) {
	pp = o - 1;
}

void call_subroutine(operand o) {
	push_address(pp);
	jump_to(o);
}

void set_memory_pointer(operand o) {
	mp = o;
}

// VALUE OPERATION
void load_value_to_register(operand o) {
	number value = o & 0x0FF;
	nibble regi = o >> 8;
	registers[regi] = value;
}

void add_value_to_register(operand o) {
	number value = o & 0x0FF;
	nibble regi = o >> 8;
	number miss = 255 - registers[regi];
	if (value > miss) {
		registers[0xF] = 1;
	} else {
		registers[0xF] = 0;
	}
	registers[regi] = registers[regi] + value;
}

void sub_value_to_register(operand o) {
	number value = o & 0x0FF;
	nibble regi = o >> 8;
	if (value > registers[regi]) {
		registers[0xF] = 1;
	} else {
		registers[0xF] = 0;
	}
	registers[regi] = registers[regi] - value;
}

// SINGLE REGISTER OPERATION
void load_register_to_memory(operand o) {
	nibble regi = (o >> 4) & 0x0F;
	memory[mp] = registers[regi];
}

void load_memory_to_register(operand o) {
	nibble regi = (o >> 4) & 0x0F;
	registers[regi] = memory[mp];
}

// TWO REGISTERS OPERATIONS
void load_register_to_register(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;;
	registers[regi1] = registers[regi2];
}

void or_registers(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	registers[regi1] = registers[regi1] | registers[regi2];
}

void and_registers(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	registers[regi1] = registers[regi1] & registers[regi2];
}

void xor_registers(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	registers[regi1] = registers[regi1] ^ registers[regi2];

}

void add_registers(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	registers[regi1] = registers[regi1] + registers[regi2];
}

void subtract_registers(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	registers[regi1] = registers[regi1] - registers[regi2];
}

void register_operations(operand o) {
	nibble opi = o >> 8;
	regi_op[opi](o);
}

void jump_if_equal(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	if (registers[regi1] == registers[regi2]) {
		pp += 1;
	}
}

void jump_if_not_equal(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	if (registers[regi1] != registers[regi2]) {
		pp += 1;
	}
}

void jump_if_lesser(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	if (registers[regi1] < registers[regi2]) {
		pp += 1;
	}

}

void jump_if_greater(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	if (registers[regi1] > registers[regi2]) {
		pp += 1;
	}

}

void conditional_jumps(operand o) {
	nibble opi = o >> 8;
	jumpif_op[opi](o);
}

// EXECUTE NEXT INSTRUCTION
void execute_instruction(instruction instr) {
	Serial.print("Executing instruction: ");
	Serial.println(instr, HEX);
	nibble opi = instr >> 12;
	operand o = instr & 0x0FFF;
	op[opi](o);
}

void execute_next_instruction() {
	pp += 1;
	if (pp >= MEM_SIZE) {
		running = false;
	} else {
		instruction instr = memory[ pp ];
		execute_instruction(instr);
	}
}

void init_vm() {
	running = false;
	pp = -1;
	mp = 0;
	cp = 0;
	for (short i = 0; i < 16; i++) {
		registers[i] = 0;
		op[i] = do_nothing;;
		regi_op[i] = 0;
		jumpif_op[i] = 0;
	}
	for (short i = 0; i < CALL_STACK_SIZE; i++) {
		cs[i] = 0;
	}
	for (short i = 0; i < MEM_SIZE; i++) {
		memory[i] = 0;
	}

	op[ 0x1 ] = halt;
	op[ 0x2 ] = return_call;
	op[ 0x3 ] = jump_to;
	op[ 0x4 ] = call_subroutine;
	op[ 0x5 ] = set_memory_pointer;
	op[ 0x6 ] = load_value_to_register;
	op[ 0x7 ] = add_value_to_register;
	op[ 0x8 ] = sub_value_to_register;

	op[ 0x9 ] = register_operations;
	regi_op[ 0x0 ] = load_register_to_memory;
	regi_op[ 0x1 ] = load_memory_to_register;
	regi_op[ 0x2 ] = load_register_to_register;
	regi_op[ 0x3 ] = or_registers;
	regi_op[ 0x4 ] = and_registers;
	regi_op[ 0x5 ] = xor_registers;
	regi_op[ 0x6 ] = add_registers;
	regi_op[ 0x7 ] = subtract_registers;

	op[ 0xA ] = conditional_jumps;
	jumpif_op[ 0x0 ] = jump_if_equal;
	jumpif_op[ 0x1 ] = jump_if_not_equal;
	jumpif_op[ 0x2 ] = jump_if_lesser;
	jumpif_op[ 0x3 ] = jump_if_greater;
}

#include <SoftPWM.h>
#include <avr/wdt.h>

SOFTPWM_DEFINE_CHANNEL(0, DDRB, PORTB, PORTB0);
SOFTPWM_DEFINE_CHANNEL(1, DDRB, PORTB, PORTB1);
SOFTPWM_DEFINE_CHANNEL(2, DDRB, PORTB, PORTB2);
SOFTPWM_DEFINE_CHANNEL(3, DDRB, PORTB, PORTB3);
SOFTPWM_DEFINE_CHANNEL(4, DDRB, PORTB, PORTB4);
SOFTPWM_DEFINE_CHANNEL(5, DDRB, PORTB, PORTB5);
SOFTPWM_DEFINE_CHANNEL(6, DDRB, PORTB, PORTB6);
SOFTPWM_DEFINE_CHANNEL(7, DDRB, PORTB, PORTB7);

SOFTPWM_DEFINE_CHANNEL(8, DDRC, PORTC, PORTB6);
SOFTPWM_DEFINE_CHANNEL(9, DDRC, PORTC, PORTB7);

SOFTPWM_DEFINE_CHANNEL(10, DDRD, PORTD, PORTD0);
SOFTPWM_DEFINE_CHANNEL(11, DDRD, PORTD, PORTD1);
SOFTPWM_DEFINE_CHANNEL(12, DDRD, PORTD, PORTD2);
SOFTPWM_DEFINE_CHANNEL(13, DDRD, PORTD, PORTD3);
SOFTPWM_DEFINE_CHANNEL(14, DDRD, PORTD, PORTD4);
SOFTPWM_DEFINE_CHANNEL(15, DDRD, PORTD, PORTD5);
SOFTPWM_DEFINE_CHANNEL(16, DDRD, PORTD, PORTD6);
SOFTPWM_DEFINE_CHANNEL(17, DDRD, PORTD, PORTD7);

SOFTPWM_DEFINE_CHANNEL(18, DDRE, PORTE, PORTE2);
SOFTPWM_DEFINE_CHANNEL(19, DDRE, PORTE, PORTE6);

SOFTPWM_DEFINE_CHANNEL(20, DDRF, PORTF, PORTF0);
SOFTPWM_DEFINE_CHANNEL(21, DDRF, PORTF, PORTF1);
SOFTPWM_DEFINE_CHANNEL(22, DDRF, PORTF, PORTF4);
SOFTPWM_DEFINE_CHANNEL(23, DDRF, PORTF, PORTF5);
SOFTPWM_DEFINE_CHANNEL(24, DDRF, PORTF, PORTF6);
SOFTPWM_DEFINE_CHANNEL(25, DDRF, PORTF, PORTF7);

/* Or you can make one with only 100 PWM levels (0 ~ 99).
By using less PWM levels, you may be able to use higher
pwm frequencies. */
SOFTPWM_DEFINE_OBJECT_WITH_PWM_LEVELS(26, 255);
SOFTPWM_DEFINE_EXTERN_OBJECT_WITH_PWM_LEVELS(26, 255);

#define PWM_MEMORY_SIZE (1 + 26) // flag + six channels of pwm
#define WAVE_MEMORY_SIZE (1 + 5) // flag + five arguments
#define TOUCH_MEMORY_SIZE (1 + 1) // flag + which place to scan
#define KEYPRESS_MEMORY_SIZE (1 + 1) // flag + character code to press
#define PWM_OFFSET (MEM_SIZE - PWM_MEMORY_SIZE)
#define WAVE_OFFSET (PWM_OFFSET - WAVE_MEMORY_SIZE)
#define TOUCH_OFFSET (WAVE_OFFSET - TOUCH_MEMORY_SIZE)
#define KEYPRESS_OFFSET (TOUCH_OFFSET - KEYPRESS_MEMORY_SIZE)
#define OFFSET KEYPRESS_OFFSET

typedef number (*wave)(uint32_t, number, number, number);
wave waves[6];
uint16_t phase, phase_r;

number wave_sine(uint32_t length, number min, number max, number offset) {
	phase = map(millis() % length, 0, length, 0, 360);
	phase_r = radians(phase);
	return map(
		sin(phase_r),
		-1, 1,
		min, max
	);
}

number wave_triangle(uint32_t length, number min, number max, number offset) {
	phase = map(millis() % length, 0, length, 0, 360);
	phase_r = radians(phase);
	if (phase < 180) {
		return map(
			phase_r,
			0, 180,
			min, max
		);
	} else {
		return map(
			phase_r,
			180, 360,
			max, min
		);
	}
}

number wave_square(uint32_t length, number min, number max, number offset) {
	phase = map(millis() % length, 0, length, 0, 360);
	if (phase < 180) {
		return min;
	} else {
		return max;
	}
}

number wave_pulse(uint32_t length, number min, number max, number offset) {
	phase = map(millis() % length, 0, length, 0, 360);
	if (phase < 30) {
		return min;
	} else {
		return max;
	}
}

number wave_rampup(uint32_t length, number min, number max, number offset) {
	phase = map(millis() % length, 0, length, 0, 360);
	phase_r = radians(phase);
	return map(
		phase_r,
		0, 360,
		0, 255
	);
}

number wave_rampdown(uint32_t length, number min, number max, number offset) {
	phase = map(millis() % length, 0, length, 0, 360);
	phase_r = radians(phase);
	return map(
		phase_r,
		0, 360,
		255, 0
	);
}

void setup(){
	Serial.begin(115200);
	Palatis::SoftPWM.begin(60);
	init_vm();
	running = false;
	waves[0x0] = wave_sine;
	waves[0x1] = wave_triangle;
	waves[0x2] = wave_square;
	waves[0x3] = wave_pulse;
	waves[0x4] = wave_rampup;
	waves[0x5] = wave_rampdown;
}

uint8_t buffer[OFFSET*2];
instruction i_buffer = 0;
uint8_t received;

void loop(){
	wdt_reset();
	while (Serial.available() > 0) {
		received = Serial.readBytes(buffer, OFFSET*2);
		running = false;
		pp = -1;
		mp = 0;
		cp = 0;
		Serial.print("Received ");
		Serial.println(received);
		Serial.print("Buffer ");
		Serial.println("");
		for (int i = 0; i < OFFSET*2; i+=2) {
			i_buffer = (buffer[i]<<8) | buffer[i+1];
			memory[mp] = i_buffer;
			Serial.print(i_buffer, HEX);
			Serial.print(" ");
			mp++;
		}
		Serial.println("");
		running = true;
	}

	if (memory[PWM_OFFSET] == 1) {
		Serial.println("Updating PWM channels");
		for (uint8_t i = 0; i < 26; i++) {
			Palatis::SoftPWM.set(i, memory[PWM_OFFSET + 1 + i]);
		}
		memory[PWM_OFFSET] = 0;
	}

	if (memory[WAVE_OFFSET] == 1) {
		Serial.println("Updating waves");
		number type = memory[WAVE_OFFSET + 1];
		uint32_t length = map(memory[WAVE_OFFSET + 2], 0, 255, 0, 10 * 1000);
		number min = memory[WAVE_OFFSET + 3];
		number max = memory[WAVE_OFFSET + 4];
		number offset = memory[WAVE_OFFSET + 5];
		registers[0x0] = waves[type](length, min, max, offset);
		memory[WAVE_OFFSET] = 0;
	}

	if (memory[TOUCH_OFFSET] == 1) {
		number place = memory[TOUCH_OFFSET + 1];
		Serial.print("Reading touch on place: ");
		Serial.println(place);
		memory[TOUCH_OFFSET] = 0;
	}

	if (memory[KEYPRESS_OFFSET] == 1) {
		number character = memory[KEYPRESS_OFFSET + 1];
		memory[KEYPRESS_OFFSET] = 0;
	}

	if (running) {
		execute_next_instruction();
	}
}
