#include <stdio.h>
#include "vm.c"

int main() {
	init_vm();
	memory[0] = 0x1000;
	running = true;
	while (running) {
		execute_next_instruction();
		printf("Executed instruction 0x%04x\n", memory[ pp ]);
	}
	return 0;
}
