#ifndef vm_h__
#define vm_h__

typedef enum { false, true } bool;
typedef uint16_t instruction;
typedef void (*operation)(instruction);
typedef uint16_t operand; // 12 bits
typedef uint16_t address; // 12 bits
typedef uint8_t number;
typedef uint8_t nibble; // 4 bits

bool running;
instruction memory[4096];
number registers[16];
address cs[16]; // call stack
nibble cp; // call stack pointer
address pp; // program pointer
address mp; // memory pointer

// FUNCTION POINTERS
operation op[16];
operation regi_op[16];
operation jumpif_op[16];

// STACK OPERATIONS
void push_address(address addr);
address pop_address();

// NO ARGUMENT OPERATIONS
void do_nothing(operand o);
void halt(operand o);
void return_call(operand o);

// ADDRESS OPERATIONS
void jump_to(operand o);
void call_subroutine(operand o);
void set_memory_pointer(operand o);

// VALUE OPERATION
void load_value_to_register(operand o);
void add_value_to_register(operand o);
void sub_value_to_register(operand o);

// SINGLE REGISTER OPERATION
void load_register_to_memory(operand o);

// TWO REGISTERS OPERATIONS
void load_memory_to_register(operand o);
void load_register_to_register(operand o);
void or_registers(operand o);
void and_registers(operand o);
void xor_registers(operand o);
void register_operations(operand o);
void jump_if_equal(operand o);
void jump_if_not_equal(operand o);
void jump_if_lesser(operand o);
void jump_if_greater(operand o);
void conditional_jumps(operand o);

// EXECUTE NEXT INSTRUCTION
void execute_instruction(instruction instr);
void execute_next_instruction();
void init_vm();

#endif
