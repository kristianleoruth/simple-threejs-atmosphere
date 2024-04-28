uniform vec3 spos;
uniform float eradius;
uniform float atmradius;

varying vec3 vpos;
varying mat4 vm_mat;
varying mat4 proj_mat;

vec4 CamSpace(vec3 p) {
  return (vm_mat * vec4(p, 1.0));
}

float origin_height(vec3 pos) {
  vec3 right = CamSpace(vec3(0.0, 0.0, -1.0)).xyz;

  vec4 c_point = vm_mat * vec4(pos, 1.0); // cameraspace point

  vec4 c_right = vm_mat * vec4(right, 1.0); // cameraspace right unit
  
  float pd = distance(c_point.xy, vec2(0.0, 0.0)); // point distance
  vec2 mini = (vm_mat * vec4(right * eradius, 1.0)).xy;

  float normalDist = pd / length(cameraPosition);
  // if (normalDist <= distance((c_right * 0.5).xy, vec2(0.0)) / length(cameraPosition)) discard;
  if (normalDist <= length(mini)) discard;
  return normalDist;
}

float rsi(vec3 so, float radius, vec3 rs, vec3 rd) {
  rd = normalize(rd);
  
  float adj = dot(so - cameraPosition, rd);

  float h = distance(rs + rd * adj, vec3(0.0));
  float x = sqrt(radius*radius - h*h);
  return 2.0 * x;
}

float ClosestToOrigin(vec3 so, vec3 rs, vec3 rd) {
  rd = normalize(rd);
  
  float adj = dot(so - cameraPosition, rd);

  return distance(rs + rd * adj, vec3(0.0));
}

/*
Line-Sphere Intersection

u = ray dir
o = ray source
c = sphere origin
r = sphere radius

a = |u|^2
b = 2(u.(o-c))
c = |o-c|^2 - r^2
*/

float mag(vec3 v) {
  return distance(v, vec3(0.0));
}

vec2 LineSphereIntersection(vec3 rd, vec3 rs, vec3 so, float sr) {
  float a = mag(rd) * mag(rd);
  float b = 2.0 * (dot(rd, rs - so));
  float c = mag(rs - so) * mag(rs - so) - sr * sr;

  float det = b*b - 4.0 * a * c;
  if (det < 0.0) {
    // no solution
    return vec2(sr, sr);
  }
  else if (det == 0.0) {
    // 1 solution
    float solution = (-b) / (2.0 * a);
    return vec2(solution, sr);
  }
  else {
    // 2 sols
    float s1 = (-b + sqrt(det)) / (2.0 * a);
    float s2 = (-b - sqrt(det)) / (2.0 * a);
    return vec2(s1, s2);
  }
}

float HeightFromSurface(vec3 P, vec3 origin, float prad, float atmrad) {
  vec3 reference = vec3(0.0, 1.0, 0.0);
  vec4 proj_planet = vm_mat * vec4(reference * prad, 1.0);
  vec4 proj_atm = vm_mat * vec4(reference * atmrad, 1.0);

  float height_surf = distance(proj_planet.xy, vec2(0.0));
  float height_atm = distance(proj_atm.xy, vec2(0.0));

  float h = distance((vm_mat * vec4(P, 1.0)).xy, vec2(0.0));
  // h *= 2.0;
  // if (h > 1.0) return 0.0;
  // else return 0.0;
  // h = h / height_atm;
  // h = h - ((10.0 / 11.5) / length(cameraPosition));
  // if (h <= (10.0 / 11.5)) return 0.0;
  if (h <= 80.0 / distance(cameraPosition, vec3(0.0))) return 0.0;
  // if (h <= 100.0 / distance(cameraPosition, vec3(0.0))) return 0.0;
  return h / height_atm;
  // return clamp(h, 0.0, 1.0);
}

#define EPOS vec3(0.0)
#define STEP_SIZE 0.1 
float SamplePoint(vec3 P, vec3 P_cam, float densityFactor) {
  // camloop
  vec3 P_sample = P;
  vec3 dir = normalize(P - P_cam); // from camera to point

  vec2 lsi = LineSphereIntersection(
    dir * (mag(P_cam - P) + atmradius),
    P_cam,
    EPOS,
    atmradius);

  if (lsi.x == atmradius) {
    return 0.0;
  }
  else if (lsi.y == atmradius) {
    return 0.0;
  }

  float len = mag((lsi.x * dir + P_cam) - (lsi.y * dir + P_cam));
  float sample_dist = 0.0;
  float density = 0.0;
  for (int i = 0; sample_dist < len; i++) {
    P_sample = P + sample_dist * dir;
    float height_sample = 
      ClosestToOrigin(EPOS, P_cam, normalize(-P_cam));
    density += exp(-densityFactor);
    sample_dist += STEP_SIZE;
    // density = 1.0;
  }
  
  return 1.0;
}

#define ATM_DECAY 10.0
// h = [0,1]
float AtmosphereSmoothing(float h) {
  // return clamp(-exp(-ATM_DECAY * h) + 1.0, 0.0, 1.0);
  // return 1.0 - clamp(tanh(h * 1.0), 0.0, 1.0);
  return clamp(exp(-ATM_DECAY * h), 0.0, 1.0);
  // float yscl = 0.5, xscl = 7.0, xslide = -0.35, yslide = 0.5;
  // return 1.0 - clamp(yscl * tanh(xscl*(h + xslide)) + yslide, 0.0, 1.0);
  // float yscl = 0.215, xscl = 105.0, xsld = 1.0;
  // return clamp(yscl * log(xscl * h + xsld), 0.0, 1.0);
  // return clamp(0.0025*exp(-6.0*h), 0.0, 1.0);
  // return 1.0 - 0.025 * exp(6.0*h);
}

void main() {
  vec3 color = vec3(0.73, 0.87, 1.0);
  float rs = origin_height(vpos);
  float alpha = 0.0;

  float decay = 6.5;
  alpha = exp(-decay * rs);

  float density = SamplePoint(vpos, cameraPosition, 1.0);
  // float _rsi = rsi(vec3(0.0), atmradius, cameraPosition, cameraPosition + vpos);
  // _rsi /= atmradius;
  // alpha = exp(-decay * _rsi);
  alpha = HeightFromSurface(vpos, EPOS, 10.0, 11.5);
  // alpha = AtmosphereSmoothing(alpha);
  gl_FragColor = vec4(color, alpha);
}