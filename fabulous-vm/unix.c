#include <stdio.h>
#include "vm.h"

int main() {
	printf("tchutchu");
	init_vm();
	memory[0] = 0xF000;
	running = true;
	while (running) {
		execute_next_instruction();
	}
	printf("hello world");
	return 0;
}
