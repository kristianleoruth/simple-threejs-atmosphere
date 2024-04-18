import $ from "jquery"
import * as Three from "three"
import * as Util from "./util.js"

console.log(import.meta.env)

function InitGame() {
  const canvas = document.querySelector("canvas.webgl")
  import.meta.env.scene = new Three.Scene()
  
  import.meta.env.scene.background = new Three.Color(0x0)
  
  import.meta.env.renderer = new Three.WebGLRenderer({ canvas: canvas, antialias: true })
  
  import.meta.env.tloader = new Three.TextureLoader()
  import.meta.env.renderer.setSize(window.innerWidth, window.innerHeight)

  import.meta.env.startTime = Date.now()

  import.meta.env.mainCamera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  import.meta.env.originToCam = new Three.Vector2(0,0)
  import.meta.env.frameDelta = 0.1
  import.meta.env.prevRender = Date.now()
}

// Start game
InitGame()

// sets frameDelta, prevRender
function SetFrameTimes() {
  import.meta.env.frameDelta = (Date.now() - import.meta.env.prevRender) * 0.001 // convert to seconds
  import.meta.env.prevRender += import.meta.env.frameDelta
}

/* Render environment scene */
function Render() {
  import.meta.env.renderer.render(import.meta.env.scene, import.meta.env.mainCamera)
}

function GameLoop() {
  console.log(`Previous render: ${import.meta.env.prevRender}\nFrame Delta: ${import.meta.env.frameDelta}`)
  
  Render()
  SetFrameTimes()
}

window.setInterval(GameLoop, import.meta.env.FRAME_TIME)

/* Events */
$(window).on("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

$(window).on("DOMMouseScroll mousewheel", e => {
  e.preventDefault()
})