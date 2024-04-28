// uniform vec3 lights[];
uniform vec3 spos; // sunpos
uniform vec3 epos; // earthpos

varying float sun_cam_angle;

float cos_rule(float a, float b, float c) {
  float numerator = pow(a, 2.0) + pow(b, 2.0) - pow(c, 2.0);
  float denominator = 2.0 * a * b;
  float theta = acos(numerator / denominator);
  return theta;
}

float te(vec3 v) {
  float numerator = pow(v.x, 2.0) + pow(v.y, 2.0) - pow(v.z, 2.0);
  float denominator = 2.0 * v.x * v.y;
  float theta = acos(numerator / denominator);
  return theta;
  // b *= 2.0;
  // c *= 2.0;
}

vec3 get_triangle(vec3 v1, vec3 v2) {
  return vec3(length(v1), length(v1 - v2), length(v2));
}

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}