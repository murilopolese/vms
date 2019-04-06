// Assignments
my_favourite_number = 200
lol = my_favourite_number
surf = wave(
  0, 1, 0.1, 0.9, 0
)
touched = hornTouched()

if (touched) {
  lol = 100
}

rightEye(0x0F0)

if(lol > 150) {
  leftEye(0xFFF)
}
