#include <stdlib.h>
#include <stdio.h>
#include "vm.c"

void dump() {
	printf("Registers: \n");
	printf("R0: %02x, R1: %02x, R2: %02x, R3: %02x, R4: %02x, R5: %02x, R6: %02x, R7: %02x\n",
		registers[0], registers[1], registers[2], registers[3], registers[4],
		registers[5], registers[6], registers[7]
	);
	printf("R8: %02x, R9: %02x, RA: %02x, RB: %02x, RC: %02x, RD: %02x, RE: %02x, RF: %02x\n",
		registers[8], registers[9], registers[10], registers[11], registers[12],
		registers[13], registers[14], registers[15]
	);
	printf("Counters: \n");
	printf("pp: %x, mp: %x, sp: %x\n", pp, mp, cp);
}

int ae_load_file_to_memory(const char *filename, char **result) {
	int size = 0;
	FILE *f = fopen(filename, "rb");
	if (f == NULL)
	{
		*result = NULL;
		return -1; // -1 means file opening fail
	}
	fseek(f, 0, SEEK_END);
	size = ftell(f);
	fseek(f, 0, SEEK_SET);
	*result = (char *)malloc(size+1);
	if (size != fread(*result, sizeof(char), size, f))
	{
		free(*result);
		return -2; // -2 means file reading fail
	}
	fclose(f);
	(*result)[size] = 0;
	return size;
}

int main() {
	init_vm();

	char *content;
	int size;
	size = ae_load_file_to_memory("examples/sum.vm", &content);
	for (short i = 0; i < size; i++) {
		// Ignore empty spaces and linebreaks
		while (content[i] == ' ') {
			i++;
		}
		// It's a comment, ignore the rest of the line
		if (content[i] == '/') {
			while(content[i] != '\n') {
				i++;
			}
		}
		if (content[i] == '\n') {
			// printf("\n");
			continue;
		}

		char s[5];
		for (short j = 0; j < 4; j++) {
			s[j] = content[i+j];
		}
		s[4] = '\0';
		i += 3;

		// printf("0x%04x\n", strtol(s, NULL, 16));
		instruction instr = strtol(s, NULL, 16);
		printf("Loading 0x%04x to address 0x%03x\n", instr, mp);
		memory[mp] = instr;
		mp++;
	}
	printf("Memory: \n");
	for (short i = 0; i < mp; i++) {
		printf("%03x %04x\n", i, memory[i]);
	}
	// return 0;

	running = true;
	while (running) {
		execute_next_instruction();
		printf("Program pointer is at 0x%03x\n", pp);
		dump();
		printf("\n");
	}
	return 0;
}
