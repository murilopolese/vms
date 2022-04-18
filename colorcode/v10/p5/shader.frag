#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform float width;
uniform float height;
uniform float mouseX;
uniform float mouseY;
uniform sampler2D rules;
uniform sampler2D grid;

vec3 color = vec3(0.0, 0.0, 0.0);

float map(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void main(void) {
  vec2 u_resolution = vec2(width, height);
  vec2 u_mouse = vec2(mouseX, mouseY);
  float grid_pixel_size = 1.0 / width;
  float rule_pixel_size = 1.0 / 6.0;

  vec2 p = gl_FragCoord.xy / u_resolution.xy;
  vec3 c = texture2D(grid, p).rgb;
  vec3 above = texture2D(grid, p+vec2(0.0, grid_pixel_size)).rgb;

  /* vec4 when[9];
  when[0] = texture2D(grid, vec2(0.0, 0.0));
  when[1] = texture2D(grid, vec2(1.0, 0.0));
  when[2] = texture2D(grid, vec2(2.0, 0.0));
  when[3] = texture2D(grid, vec2(0.0, 1.0));
  when[4] = texture2D(grid, vec2(1.0, 1.0));
  when[5] = texture2D(grid, vec2(2.0, 1.0));
  when[6] = texture2D(grid, vec2(0.0, 2.0));
  when[7] = texture2D(grid, vec2(1.0, 2.0));
  when[8] = texture2D(grid, vec2(2.0, 2.0)); */

  vec4 center_rule = texture2D(grid, vec2(0.0, rule_pixel_size));

  color = c;
  if (
    center_rule.a == 1.0 &&
    center_rule.rgb == color
    ) {
    color = vec3(1.0, 0.0, 0.4);
  }

  /* if (c.r == 0.0 && above.r == 1.0) {
    color = vec3(1.0, 0.0, 0.0);
  } */

  gl_FragColor = vec4(color, 1.0);
}
