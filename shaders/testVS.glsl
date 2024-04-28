uniform vec3 spos;
uniform float eradius;
uniform float atmradius;

varying vec3 vpos;
varying mat4 vm_mat;
varying mat4 proj_mat;

void main(void) {
  vpos = position;
  vm_mat = viewMatrix;
  proj_mat = projectionMatrix;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
}