#include <stdint.h>
#include "vm.h"

// STACK OPERATIONS
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
	nibble regi = o>> 8;
	if (value > registers[regi]) {
		registers[0xF] = 1;
	} else {
		registers[0xF] = 0;
	}
	registers[regi] = registers[regi] - value;
}

// SINGLE REGISTER OPERATION
void load_register_to_memory(operand o) {
	nibble regi = o >> 8;
	memory[mp] = registers[regi];
}

// TWO REGISTERS OPERATIONS
void load_memory_to_register(operand o) {
	nibble regi = (o >> 4) & 0x0F;
	registers[regi] = memory[mp];
}

void load_register_to_register(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;;
	registers[regi1] = registers[regi2];
}

void or_registers(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	registers[regi1] = registers[regi1] |
			   registers[regi2];
}

void and_registers(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	registers[regi1] = registers[regi1] &
			   registers[regi2];
}

void xor_registers(operand o) {
	nibble regi1 = (o >> 4) & 0x0F;
	nibble regi2 = o & 0x00F;
	registers[regi1] = registers[regi1] ^
			   registers[regi2];

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
	nibble opi = instr >> 12;
	operand o = instr & 0x0FFF;
	op[opi](o);
}

void execute_next_instruction() {
	pp += 1;
	instruction instr = memory[pp];
	execute_instruction(instr);
}

void init_vm() {
	running = false;
	pp = -1;
	mp = 0;
	cp = 0;
	for (short i = 0; i < 16; i++) {
		registers[i] = 0;
		cs[i] = 0;
		op[i] = do_nothing;;
		regi_op[i] = 0;
		jumpif_op[i] = 0;
	}
	for (short i = 0; i < 4096; i++) {
		memory[i] = 0;
	}
	op[0x1] = halt;
	op[0x2] = return_call;

	op[0x3] = jump_to;
	op[0x4] = call_subroutine;
	op[0x5] = set_memory_pointer;
	
	op[0x6] = load_value_to_register;
	op[0x7] = add_value_to_register;
	op[0x8] = sub_value_to_register;
	
	op[0x9] = register_operations;
	op[0xA] = conditional_jumps;
}
