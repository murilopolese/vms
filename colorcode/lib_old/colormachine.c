#ifndef COLUMNS
#define COLUMNS 8
#endif
#ifndef ROWS
#define ROWS 8
#endif
#ifndef EDIT
#define EDIT EDIT
#endif
#ifndef CODE
#define CODE CODE
#endif
#ifndef RUN
#define RUN RUN
#endif

typedef unsigned char color;
typedef unsigned char rule[2][3][3];
typedef unsigned char position[2];
typedef enum { EDIT, CODE, RUN } views;

// STATE
struct state {
  color tileMap[ROWS][COLUMNS];
  rule rules[8][16];
  position cursor;
  views view;
  unsigned char selectedColor;
  unsigned char selectedRule;
};


struct state clearTileMap(struct state s) {
  for (int y = 0; y < ROWS; y++) {
    for (int x = 0; x < COLUMNS; x++) {
      s.tileMap[y][x] = 0;
    }
  }
  return s;
}

struct state clearRules(struct state s) {
  for (int event = 0; event < 8; event++) {
    for (int i = 0; i < 16; i++) {
      for (int y = 0; y < 3; y++) {
        for (int x = 0; x < 3; x++) {
          s.rules[event][i][0][y][x] = 0; // WHEN
          s.rules[event][i][1][y][x] = 0; // THEN
        }
      }

    }
  }
  return s;
}

struct state setTile(struct state s, int x, int y, unsigned char value) {
  s.tileMap[y][x] = value;
  return s;
}

struct state setCursor(struct state s, int x, int y) {
  s.cursor[0] = x;
  s.cursor[1] = y;
  return s;
}

void render(struct state s) {
      switch(s.view) {
        case EDIT:
          for (int y = 0; y < ROWS; y++) {
            for (int x = 0; x < COLUMNS; x++) {
              if (s.cursor[0] == x && s.cursor[1] == y) {
                printf(". ");
              } else {
                printf("%d ", s.tileMap[y][x]);
              }
            }
            printf("\n");
          }
          break;
        case CODE:
          // Events
          for (int x = 0; x < COLUMNS; x++) {
            if (s.cursor[0] == x && s.cursor[1] == 0) {
              printf(". ");
            } else if (s.selectedColor == x) {
              printf("%d ", 2);
            } else {
              printf("%d ", 1);
            }
          }
          printf("\n");
          // Event slots
          for (int y = 0; y < 2; y++) {
            for (int x = 0; x < COLUMNS; x++) {
              if (s.cursor[0] == x && s.cursor[1] == 0) {
                printf(". ");
              } else if (s.selectedRule == ( x + (y*COLUMNS) )) {
                printf("%d ", 4);
              } else {
                printf("%d ", 3);
              }
            }
            printf("\n");
          }
          // Color pallete
          for (int y = 2; y < 4; y++) {
            for (int x = 0; x < COLUMNS; x++) {
              if (s.cursor[0] == x && s.cursor[1] == 0) {
                printf(". ");
              } else {
                printf("%d ", ( x + ( (y-2) * COLUMNS) ) );
              }
            }
            printf("\n");
          }
          // Rules slots
          for (int y = 4; y < 4; y++) {
            for (int x = 0; x < COLUMNS; x++) {
              if (s.cursor[0] == x && s.cursor[1] == 0) {
                printf(". ");
              } else {
                printf("%d ", ( x + ( (y-2) * COLUMNS) ) );
              }
            }
            printf("\n");
          }
          break;
        default:
          printf("  ");
  }

}
