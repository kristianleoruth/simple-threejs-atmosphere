import $ from "jquery"
import * as Three from "three"
import * as Util from "./util.js"

export class GameMaster {
  constructor(window) { 
    this.window = window
    this.FRAME_TIME = 0.1
    this.prevRender = null
  }

  _InitEvents() {
    /* Events */
    $(window).on("resize", () => {
      this.mainCamera.aspect = window.innerWidth / window.innerHeight
      this.mainCamera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }

  _InitGame() {
    const canvas = document.querySelector("canvas.webgl")
    this.scene = new Three.Scene()
    
    this.scene.background = new Three.Color(0x0)
    
    this.renderer = new Three.WebGLRenderer({ canvas: canvas, antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.tloader = new Three.TextureLoader()
  
    this.startTime = Date.now()
  
    this.mainCamera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.scene.add(this.mainCamera)
  
    this.originToCam = new Three.Vector2(0,0)
    this.frameDelta = 0.1
    this.prevRender = Date.now()
  }

  // sets frameDelta, prevRender
  _SetFrameTimes() {
    this.frameDelta = (Date.now() - this.prevRender) * 0.001 // convert to seconds
    this.prevRender += this.frameDelta
  }

  /* Render environment scene */
  _Render() {
    this.renderer.render(this.scene, this.mainCamera)
  }

  Init() {
    this._InitGame()
    this._InitEvents()
    this.CustomStartupLogic()
  }

  CustomStartupLogic = () => {}
  CustomRuntimeLogic = () => {}
}

const GameLoop = (gameMaster) => {
  gameMaster.CustomRuntimeLogic()
  gameMaster._Render()
  gameMaster._SetFrameTimes()
}

/**
 * 
 * @param {GameMaster} gameMaster 
 */
export const SetupGameLoop = (gameMaster) => {
  window.setInterval(GameLoop, gameMaster.FRAME_TIME, gameMaster)
}

