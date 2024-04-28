uniform vec3 spos;
uniform float eradius;
uniform float atmradius;

varying vec3 viewray;
varying vec3 sunray;
varying vec3 vpos;

varying mat4 vm_mat;
varying mat4 proj_mat;

float samplep(vec3 P) {
  vec3 Pcam = P + cameraPosition;
  vec3 C = -cameraPosition;

  float adj = dot(C, normalize(Pcam));
  float x = length(adj) - length(Pcam);
  return 2.0 * x; 
}

#define THICK 0.05
float alphaedit(vec3 P) {
  vec4 pos = vec4(P, 1.0);
  vec4 proj = proj_mat * vm_mat * pos;

  vec3 right = vec3(vm_mat[0][0], vm_mat[1][0], vm_mat[2][0]);
  float unit_len = length(proj_mat * vm_mat * vec4(right, 1.0));

  float h = length(proj);
  
  return h;
}

void main() {
  vec3 color = vec3(0.73, 0.87, 1.0);
  float rs = alphaedit(vpos);
  gl_FragColor = vec4(color, 1.0 - (rs * THICK));
}