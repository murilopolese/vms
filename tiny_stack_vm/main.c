#include <stdio.h>

typedef unsigned int instruction;
typedef int number;

typedef unsigned char flag;
enum { false, true };

#define STACK_SIZE 8
#define PROG_SIZE 64

// STACK
number stack[STACK_SIZE];
number stack_pointer = -1;
// PROGRAM MEMORY
instruction program[PROG_SIZE];
number program_pointer = -1;
// RUNTIME
flag running = false;
// CORE FUNCTIONS
enum {
	HALT,
	DUP, POP,
	ADD, SUB, MUL, DIV,	MOD,
	/* TODO:
	BAND, BOR, BLEFT, BRIGHT,
	AND, OR, NOT, EQ, LT, GT,
	GOTO, GOSUB, RETURN,
	IF, ELSE, ENDIF,
	WHILE, ENDWHILE,
	DELAY
	*/
};

void load_program(instruction *p) {
	for (number i = 0; i < PROG_SIZE; i++) {
		program[i] = p[i];
	}
}

void print_program() {
	printf("PROGRAM:\n");
	for (number i = 0; i < PROG_SIZE; i++) {
		printf("%03X ", program[i]);
	}
	printf("\n");
}

void print_stack() {
	printf("STACK POINTER: %d\n", stack_pointer);
	printf("STACK:\n");
	for (number i = 0; i < STACK_SIZE; i++) {
		printf("%d ", stack[i]);
	}
	printf("\n");
}

void push_to_stack(number v) {
	printf("PUSH %d\n", v);
	stack_pointer++;
	stack[stack_pointer] = v;
}

// return instruction as number
number get_value(instruction i) {
	return i & 0x0FF;
}

// return type of instruction
flag get_type(instruction i) {
	return i >> 8;
}

// return instruction from number
instruction get_instruction(number v) {
	return v | 0x100;
}

void do_primitive(instruction i) {
	number instruction_symbol = get_value(i);
	switch (instruction_symbol) {
		case HALT:
			printf("HALT\n");
			running = false;
		break;
		case DUP:
			printf("DUP %d\n", stack[stack_pointer]);
			stack[stack_pointer+1] = stack[stack_pointer];
			stack_pointer++;
		break;
		case POP:
			printf("POP %d\n", stack[stack_pointer]);
			stack_pointer--;
		break;
		case ADD:
			printf("ADD %d %d\n", stack[stack_pointer -1 ], stack[stack_pointer]);
			stack[stack_pointer-1] = stack[stack_pointer - 1] + stack[stack_pointer];
			stack_pointer--;
		break;
		case SUB:
			printf("SUB %d %d\n", stack[stack_pointer -1 ], stack[stack_pointer]);
			stack[stack_pointer-1] = stack[stack_pointer - 1] - stack[stack_pointer];
			stack_pointer--;
		break;
		case MUL:
			printf("MUL %d %d\n", stack[stack_pointer -1 ], stack[stack_pointer]);
			stack[stack_pointer-1] = stack[stack_pointer - 1] * stack[stack_pointer];
			stack_pointer--;
		break;
		case DIV:
			printf("DIV %d %d\n", stack[stack_pointer -1 ], stack[stack_pointer]);
			stack[stack_pointer-1] = stack[stack_pointer - 1] / stack[stack_pointer];
			stack_pointer--;
		break;
		case MOD:
			printf("MOD %d %d\n", stack[stack_pointer -1 ], stack[stack_pointer]);
			stack[stack_pointer-1] = stack[stack_pointer - 1] % stack[stack_pointer];
			stack_pointer--;
		break;
	}
}

void parse_instruction() {
	// INSTRUCTION 0x  0     00
	//                type  value
	// if type is 0: push value (number) to stack
	// if type is 1: do primitive
	program_pointer++;
	instruction i = program[program_pointer];
	flag type = get_type(i);
	number value = get_value(i);

	if (type == 0) {
		push_to_stack(value);
	} else if (type == 1) {
		do_primitive(i);
		printf("TOS: %d\n", stack[stack_pointer]);
	} else {
		printf("Unrecognized instruction \n");
	}
}

int main(void) {
	// lexer should output an array of instructions
	instruction example_program[PROG_SIZE] = {
		2, get_instruction(DUP), get_instruction(ADD),
		3, get_instruction(MOD),
		4, get_instruction(SUB),
		10, get_instruction(MUL),
		5, get_instruction(DIV),
		get_instruction(POP),
		get_instruction(HALT)
	};

	// Load example program to program memory
	load_program(example_program);
	print_program();

	// RUNTIME
	running = true;
	while (running) {
		parse_instruction();
	}

	// PRINT STACK FOR DEBUG
	print_stack();
	return 0;
}
