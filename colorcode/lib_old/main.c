#include <stdio.h>
#include "colormachine.c"

int main(int argc, char ** argv) {
  struct state s;
  // s.view = CODE;
  printf("%d\n", s.view);

  s = clearTileMap(s);
  s = clearRules(s);
  s = setCursor(s, 12, 9);

  // Draw walls
  for (int y = 0; y < ROWS; y++) {
    s.tileMap[y][0] = 1;
    s.tileMap[y][COLUMNS-1] = 1;
  }
  for (int x = 0; x < COLUMNS; x++) {
    s.tileMap[0][x] = 1;
    s.tileMap[ROWS-1][x] = 1;
  }


  render(s);

}
