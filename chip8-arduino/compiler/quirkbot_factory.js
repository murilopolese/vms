offset = 0.5
if (leftArmTouched()) {
} else {
  offset = 0
}

blinkFast1 = wave(
	0, // type
	0.1, // length
	0, // min
	1, // max
	offset // offset
)

blinkSlow1 = wave(
	0, 0.4, 0, 1, offset
)

blinkFast2 = wave(
	0, 0.4, 0, 1, offset
)
blinkSlow2 = wave(
	0, 0.8, 0, 1, offset
)

if (hornTouched()) {
	leftEye(blinkFast2)
	servo1(blinkFast2)
	rightMouth(blinkFast2)
	rightEye(blinkSlow2)
	servo2(blinkSlow2)
	leftMouth(blinkSlow2)
} else {
	leftEye(blinkFast1)
	servo1(blinkFast1)
	rightMouth(blinkFast1)
	rightEye(blinkSlow1)
	servo2(blinkSlow2)
	leftMouth(blinkSlow1)
}
