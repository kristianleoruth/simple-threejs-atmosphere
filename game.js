import * as Three from "three"
import $ from "jquery"
import * as Util from "./util.js"
import * as GameMaster from "./game-master.js"

const CAM_DIST = 20
const FOV_FACTOR_IN = 1.05
const FOV_FACTOR_OUT = 0.95

let gm // GameMaster
let earth
let atmosphere

// Load atmosphere shader
const atmVS = await LoadFileContents("./shaders/testVS.glsl")
const atmFS = await LoadFileContents("./shaders/atm_testfs.glsl")
// console.log(atmFS)

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
  const earthGeo = new Three.SphereGeometry(eradius, 500, 300)
  const earthMat = new Three.MeshLambertMaterial({
    color: 0x142c54,
  })
  earth = new Three.Mesh(earthGeo, earthMat)
  earth.position.set(0,0,0)
  gm.scene.add(earth)

  const dLight = new Three.DirectionalLight(0xfffffffff, 5)
  dLight.position.set(10, 20, 0)
  gm.scene.add(dLight)

  const d2Light = new Three.DirectionalLight(0xfffffffff, 5)
  dLight.position.set(20, 15, 0)
  gm.scene.add(d2Light)

  const aLight = new Three.AmbientLight(0xffffffff, 0.01)
  gm.scene.add(aLight)

  const axes = new Three.AxesHelper(20)
  // yellow, green, blue
  axes.setColors(0xfcba03, 0x29b50d, 0x091bde)
  gm.scene.add(axes)

  const atmGeo = new Three.SphereGeometry(11.5, 300, 200)
  const uniforms = {
    atmradius: 1.0,
    eradius: eradius,
    spos: dLight.position,
  }
  const atmMat = new Three.ShaderMaterial({
    uniforms: uniforms,
    transparent: true,
    vertexShader: atmVS,
    fragmentShader: atmFS,
  })
  // const atmMat = new Three.MeshLambertMaterial({
  //   color: 0xffffffff,
  // })
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
  gm.mainCamera.fov = Util.Clamp(gm.mainCamera.fov, 100, 30)
  gm.mainCamera.updateProjectionMatrix()
}

function UpdateCamPos() {
  let cpos = Util.FromAngles(gm.originToCam.x, gm.originToCam.y, CAM_DIST)
  gm.mainCamera.position.set(cpos.x, cpos.y, cpos.z)
  gm.mainCamera.lookAt(0,0,0)
}

function RotateEarth() {
  earth.rotation.z += 0.1
}

$(window).on("mousewheel DOMMouseScroll scroll", (e) => {
  // e.preventDefault();
  Zoom(e.originalEvent.wheelDelta)
})

InitGameMaster()