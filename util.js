import * as Three from "three"
import $ from "jquery"

// Theta is angle from x-axis, phi is angle from z-axis
export function FromAngles(theta, phi, scale) {
  let x = Math.cos(theta) * Math.cos(phi) * scale
  let y = Math.sin(phi) * scale
  let z = Math.cos(phi) * Math.sin(theta) * scale
  return new Three.Vector3(x, y, z)
}

export function Clamp(val, max, min) {
  if (val > max) return max
  else if (val < min) return min
  else return val
}

export function WrapAngle(theta) {
  if (theta >= 2*Math.PI) return theta - 2 * Math.PI
  else if (theta <= 0) return theta + 2 * Math.PI
  else return theta
}