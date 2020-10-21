#include <stdio.h>
#include "colormachine.c"

void printTiles() {
  printf("\nMemory tilemap\n");
  for (int y = 0; y < 16; y++) {
    for (int x = 0; x < 16; x++) {
      if (cursor[0] == x && cursor[1] == y) {
        printf(". ");
      } else {
        printf("%d ", memory[y][x]);
      }
    }
    printf("\n");
  }
}

void printRules() {
  printf("\nRules\n");
  for(int event = 0; event < 8; event++) {
    printf("\nevent: %d\n", event);
    for(int slot = 0; slot < 16; slot++) {
      printf("\nslot: %d\n", slot);
      for(int rule = 0; rule < 2; rule++) {
        printf("rule: %d\n", rule);
        for(int y = 0; y < 3; y++) {
          for(int x = 0; x < 3; x++) {
            printf("%d ", rules[event][slot][rule][y][x]);
          }
          printf("\n");
        }
      }
    }
  }
}

void render() {
  printf("cursor: %d %d\n", cursor[0], cursor[1]);
  printf("selectedColor: %d\n", selectedColor);
  printf("selectedEvent: %d\n", selectedEvent);
  printf("selectedSlot: %d\n", selectedSlot);
  printf("view: %d\n", view);

  printTiles();
  printRules();
}

int main() {
  eraseMemory();
  eraseRules();

  setMode(0);
  selectEvent(0);
  selectSlot(0);

  setCursor(3, 3);

  selectColor(1);
  setTile(4, 4);
  selectColor(2);
  setTile(4, 3);

  selectColor(1);
  setRule(1, 1, 0);
  selectColor(2);
  setRule(1, 0, 0);

  selectColor(2);
  setRule(1, 1, 1);

  selectSlot(1);
  selectColor(2);
  setRule(1, 1, 0);
  selectColor(3);
  setRule(1, 1, 1);

  printTiles();

  applyRules(0);
  applyRules(0);

  printTiles();
  printRules();

  return 0;
}
