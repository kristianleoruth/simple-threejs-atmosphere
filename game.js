import $ from "jquery"
import * as Three from "three"
import * as Util from "./util.js"

let env = import.meta.env

function InitGame() {
  const canvas = document.querySelector("canvas.webgl")
  env.scene = new Three.Scene()
  
  env.scene.background = new Three.Color(0x0)
  
  env.renderer = new Three.WebGLRenderer({ canvas: canvas, antialias: true })
  
  env.tloader = new Three.TextureLoader()
  env.renderer.setSize(window.innerWidth, window.innerHeight)

  env.startTime = Date.now()

  env.mainCamera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  env.originToCam = new Three.Vector2(0,0)
  env.frameDelta = 0.1
  env.prevRender = Date.now()
}

// Start game
InitGame()

// sets frameDelta, prevRender
function SetFrameTimes() {
  env.frameDelta = (Date.now() - env.prevRender) * 0.001 // convert to seconds
  env.prevRender += env.frameDelta
}

/* Render environment scene */
function Render() {
  env.renderer.render(env.scene, env.mainCamera)
}

function GameLoop() {
  console.log(`Previous render: ${env.prevRender}\nFrame Delta: ${env.frameDelta}`)
  
  Render()
  SetFrameTimes()
}

window.setInterval(GameLoop, env.FRAME_TIME)

/* Events */
$(window).on("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

$(window).on("DOMMouseScroll mousewheel", e => {
  e.preventDefault()
})