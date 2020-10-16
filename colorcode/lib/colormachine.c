typedef char number;
typedef enum { EDIT, CODE, RUN } mode;
typedef enum { FALSE, TRUE } bool;

number memory[16][16];
number rules[8][16][2][3][3];
number cursor[2];
number selectedColor;
number selectedEvent;
number selectedSlot;
mode view;

void setTile(number x, number y) {
  memory[y][x] = selectedColor;
}
void eraseTile(number x, number y) {
  memory[y][x] = 0;
}
void setMode(mode m) {
  view = m;
}
void selectColor(number colorIndex) {
  selectedColor = colorIndex;
}
void selectEvent(number eventIndex) {
  selectedEvent = eventIndex;
}
void selectSlot(number slotIndex) {
  selectedSlot = slotIndex;
}
void setRule(number x, number y, number whenOrThen) {
  rules[selectedEvent][selectedSlot][whenOrThen][y][x] = selectedColor;
}
void eraseRule(number x, number y, number whenOrThen) {
  rules[selectedEvent][selectedSlot][whenOrThen][y][x] = -1;
}
void setCursor(number x, number y) {
  cursor[0] = x;
  cursor[1] = y;
}
void applyRules(number eventIndex) {
  number newMemory[16][16];
  for(int i = 0; i < 16; i++) {
    for(int j = 0; j < 16; j++) {
      newMemory[i][j] = memory[i][j];
    }
  }

  for (int y = 1; y < 15; y++) {
    for (int x = 1; x < 15; x++) {
      // Run through the event rules
      for (int i = 0; i < 16; i++) {
        // If center of "then" is not "-1"
        if (rules[eventIndex][i][0][1][1] != -1) {
          bool matched = TRUE;
          for(int _y = 0; _y < 3; _y++) {
            for(int _x = 0; _x < 3; _x++) {
              number _cel = rules[eventIndex][i][0][_y][_x];
              if (_cel != -1) { // Rule is not empty
                if (memory[y+_y-1][x+_x-1] != rules[eventIndex][i][0][_y][_x]) {
                  // Memory does not match rule
                  matched = FALSE;
                }
              }
            }
          }
          if (matched == TRUE) {
            for(int _y = 0; _y < 3; _y++) {
              for(int _x = 0; _x < 3; _x++) {
                number _cel = rules[eventIndex][i][1][_y][_x];
                if (_cel != -1) {
                  newMemory[y+_y-1][x+_x-1] = rules[eventIndex][i][1][_y][_x];
                }
              }
            }
          }
        }
      }
    }
  }

  for(int i = 0; i < 16; i++) {
    for(int j = 0; j < 16; j++) {
      memory[i][j] = newMemory[i][j];
    }
  }
}

void eraseMemory() {
  for(int i = 0; i < 16; i++) {
    for(int j = 0; j < 16; j++) {
      eraseTile(i, j);
    }
  }
}
void eraseRules() {
  for(int event = 0; event < 8; event++) {
    selectEvent(event);
    for(int slot = 0; slot < 16; slot++) {
      selectSlot(slot);
      for(int rule = 0; rule < 2; rule++) {
        for(int x = 0; x < 3; x++) {
          for(int y = 0; y < 3; y++) {
            eraseRule(x, y, rule);
          }
        }
      }
    }
  }
}
