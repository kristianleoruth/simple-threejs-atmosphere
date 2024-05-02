import * as Three from "three"
import $ from "jquery"
import * as Util from "./util.js"
import * as GameMaster from "./game-master.js"

const CAM_DIST = 20
const CAM_ROTATE_SPEED = 0.0025
const FOV_FACTOR_IN = 1.05
const FOV_FACTOR_OUT = 0.95

let gm // GameMaster
let earth
let atmosphere

// Load atmosphere shader
const atmVS = await LoadFileContents("./shaders/atm_vs.glsl")
const atmFS = await LoadFileContents("./shaders/atm_fs.glsl")

async function LoadFileContents(path) {
  try {
    const content = await (await fetch(path)).text()
    return content
  }
  catch (e) {
    console.log(e)
  }
}

function Start() {
  const eradius = 10;
  const earthGeo = new Three.SphereGeometry(eradius, 100, 100)
  const earthMat = new Three.MeshLambertMaterial({
    color: 0x142c54,
  })
  earth = new Three.Mesh(earthGeo, earthMat)
  earth.position.set(0,0,0)
  gm.scene.add(earth)

  const dLight = new Three.DirectionalLight(0xfffffffff, 5)
  dLight.position.set(10, 20, 0)
  gm.scene.add(dLight)

  /* Stars */
  const starMaterial = new Three.PointsMaterial({
    color: 0xffffff
  })
  const starGeometry = new Three.BufferGeometry()

  const starPoints = []
  for (let i = 0; i < 10000; i++) {
    let x = (Math.random() - 0.5) * 6000
    let y = (Math.random() - 0.5) * 6000
    let z = (Math.random() - 0.5) * 6000
    if ((new Three.Vector3(x,y,z)).length() <= 200) continue
    starPoints.push(x, y, z)
  }

  starGeometry.setAttribute('position', new Three.Float32BufferAttribute(starPoints, 3))
  const stars = new Three.Points(starGeometry, starMaterial)
  gm.scene.add(stars)

  // const d2Light = new Three.DirectionalLight(0xfffffffff, 5)
  // dLight.position.set(20, 15, 0)
  // gm.scene.add(d2Light)

  const aLight = new Three.AmbientLight(0xffffffff, 0.01)
  gm.scene.add(aLight)

  const axes = new Three.AxesHelper(20)
  // yellow, green, blue
  axes.setColors(0xfcba03, 0x29b50d, 0x091bde)
  // gm.scene.add(axes)

  const _eradius = eradius * 1.0
  const atmSizeMult = 1.3
  const atmGeo = new Three.SphereGeometry(_eradius * atmSizeMult, 64, 64)
  const uniforms = {
    eradius: {value: _eradius},
    atmradius: {value: _eradius * atmSizeMult},
    epos: {value: new Three.Vector3(0)},
    sunPos: {value: dLight.position},
  }
  const atmMat = new Three.ShaderMaterial({
    uniforms: uniforms,
    transparent: true,
    vertexShader: atmVS,
    fragmentShader: atmFS,
  })
  atmosphere = new Three.Mesh(atmGeo, atmMat)
  atmosphere.position.set(0,0,0)
  gm.scene.add(atmosphere)
}

function Game() {
  RotateEarth()
  UpdateCamPos()
}

function InitGameMaster() {
  gm = new GameMaster.GameMaster(window)
  gm.CustomStartupLogic = Start
  gm.Init()
  gm.CustomRuntimeLogic = Game
  GameMaster.SetupGameLoop(gm)
}

function Zoom(scrollDelta) {
  if (scrollDelta > 0) {
    gm.mainCamera.fov *= FOV_FACTOR_IN
  }
  else gm.mainCamera.fov *= FOV_FACTOR_OUT
  gm.mainCamera.fov = Util.Clamp(gm.mainCamera.fov, 120, 30)
  gm.mainCamera.updateProjectionMatrix()
}

let prevMousePos = null
let handleMouseInput = false
function HandleView(mEvent) {
  if (!handleMouseInput) return
  const mpos = new Three.Vector2(mEvent.clientX, mEvent.clientY)
  
  const vdiff = new Three.Vector2(mpos.x - prevMousePos.x, mpos.y - prevMousePos.y)
  
  gm.originToCam.x += CAM_ROTATE_SPEED * vdiff.x
  gm.originToCam.x = Util.WrapAngle(gm.originToCam.x)
  gm.originToCam.y += CAM_ROTATE_SPEED * vdiff.y
  gm.originToCam.y = Util.Clamp(gm.originToCam.y, 1.5, -1.5)

  prevMousePos.x = mpos.x
  prevMousePos.y = mpos.y
}

function UpdateCamPos() {
  let cpos = Util.FromAngles(gm.originToCam.x, gm.originToCam.y, CAM_DIST)
  gm.mainCamera.position.set(cpos.x, cpos.y, cpos.z)
  gm.mainCamera.lookAt(0,0,0)
}

function RotateEarth() {
  earth.rotation.z += 0.1
}

$(document.body).on("mousedown", e => {
  handleMouseInput = true
  prevMousePos = new Three.Vector2(e.clientX, e.clientY)
})

$(document.body).on("mouseup", e => {
  handleMouseInput = false
})

$(document.body).on("mousemove", e => {
  HandleView(e)
})

$(window).on("mousewheel DOMMouseScroll scroll", (e) => {
  // e.preventDefault();
  Zoom(e.originalEvent.wheelDelta)
})

InitGameMaster()