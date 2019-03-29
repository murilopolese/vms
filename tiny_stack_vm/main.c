#include <stdio.h>

typedef unsigned int instruction;
typedef int number;

typedef unsigned char flag;
enum { false, true };

#define STACK_SIZE 8
#define CALL_STACK_SIZE 8
#define PROG_SIZE 64

// STACK
number stack[STACK_SIZE];
number stack_pointer = -1;
// CALL STACK
number call_stack[STACK_SIZE];
number call_stack_pointer = -1;
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
	AND, OR, NOT, EQ, LT, GT,
	IF, ELSE, ENDIF
	/* TODO:
	BAND, BOR, BLEFT, BRIGHT,
	GOTO, GOSUB, RETURN,
	WHILE, ENDWHILE,
	DELAY
	*/
};

// return instruction as number
number get_value(instruction i) {
	return i & 0x0FF;
}

// return type of instruction
flag get_type(instruction i) {
	return i >> 8;
}

// return instruction from number
instruction _(number v) {
	return v | 0x100;
}

void print_core() {
	printf("%03x - HALT\n", _(HALT));
	printf("%03x - DUP\n", _(DUP));
	printf("%03x - POP\n", _(POP));
	printf("%03x - ADD\n", _(ADD));
	printf("%03x - SUB\n", _(SUB));
	printf("%03x - MUL\n", _(MUL));
	printf("%03x - DIV\n", _(DIV));
	printf("%03x - MOD\n", _(MOD));
	printf("%03x - AND\n", _(AND));
	printf("%03x - OR\n", _(OR));
	printf("%03x - NOT\n", _(NOT));
	printf("%03x - EQ\n", _(EQ));
	printf("%03x - LT\n", _(LT));
	printf("%03x - GT\n", _(GT));
	printf("%03x - IF\n", _(IF));
	printf("%03x - ELSE\n", _(ELSE));
	printf("%03x - ENDIF\n", _(ENDIF));
}

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
	printf("STACK:\n");
	for (number i = 0; i < STACK_SIZE; i++) {
		if (i == stack_pointer) {
			printf("[ ");
		}
		printf("%d ", stack[i]);
		if (i == stack_pointer) {
			printf("] ");
		}
	}
	printf("\n");
}

void push_to_stack(number v) {
	printf("PUSH %d\n", v);
	stack_pointer++;
	stack[stack_pointer] = v;
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
		case AND:
			printf("AND %d %d\n", stack[stack_pointer -1 ], stack[stack_pointer]);
			stack[stack_pointer-1] = (stack[stack_pointer - 1] == true)
								  && (stack[stack_pointer] == true);
			stack_pointer--;
		break;
		case OR:
			printf("OR %d %d\n", stack[stack_pointer -1 ], stack[stack_pointer]);
			stack[stack_pointer-1] = (stack[stack_pointer - 1] == true)
								  || (stack[stack_pointer] == true);
			stack_pointer--;
		break;
		case NOT:
			printf("NOT %d\n", stack[stack_pointer]);
			if (stack[stack_pointer] == false) {
				stack[stack_pointer] = true;
			} else {
				stack[stack_pointer] = false;
			}
		break;
		case EQ:
			printf("EQ %d %d\n", stack[stack_pointer -1 ], stack[stack_pointer]);
			stack[stack_pointer-1] = stack[stack_pointer - 1] == stack[stack_pointer];
			stack_pointer--;
		break;
		case LT:
			printf("LT %d %d\n", stack[stack_pointer -1 ], stack[stack_pointer]);
			stack[stack_pointer-1] = stack[stack_pointer - 1] < stack[stack_pointer];
			stack_pointer--;
		break;
		case GT:
			printf("GT %d %d\n", stack[stack_pointer -1 ], stack[stack_pointer]);
			stack[stack_pointer-1] = stack[stack_pointer - 1] > stack[stack_pointer];
			stack_pointer--;
		break;
		case IF:
			printf("IF %d\n", stack[stack_pointer]);
			number stack_value = stack[stack_pointer];
			number block = 0;
			while (program[program_pointer] != _(ENDIF)) {
				if (program[program_pointer] == _(ELSE)) {
					block = 1;
				}
				if (block == 0) {
					// printf("running if %d ", stack_value);
					if (stack_value == false) {
						// printf("skiping %03x\n", program[program_pointer]);
						program_pointer++;
					} else {
						// printf("running %03x\n", program[program_pointer + 1]);
						parse_instruction();
					}
				}
				if (block == 1) {
					// printf("running else %d ", stack_value);
					if (stack_value == false) {
						// printf("running %03x\n", program[program_pointer + 1]);
						parse_instruction();
					} else {
						// printf("skiping %03x\n", program[program_pointer]);
						program_pointer++;
					}
				}
			}
		break;
		case ELSE:
		default:
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
	} else {
		printf("Unrecognized instruction \n");
	}
}

int main(void) {
	// lexer should output an array of instructions
	instruction example_program[PROG_SIZE] = {
		2, 3, _(LT),
		_(IF),
			100,
			200,
		_(ELSE),
			50,
			25,
		_(ENDIF),
		_(ADD),

		_(HALT)
	};

	// print core functions and its opcodes
	print_core();
	// Load example program to program memory
	load_program(example_program);
	print_program();

	// RUNTIME
	printf("EXECUTING:\n");
	running = true;
	while (running) {
		parse_instruction();
	}

	// PRINT STACK FOR DEBUG
	print_stack();
	return 0;
}
