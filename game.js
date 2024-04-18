import * as Three from "three"
import $ from "jquery"
import Util from "./util.js"
import * as GameMaster from "./game-master.js"

let gm = new GameMaster.GameMaster(window)
gm.CustomStartupLogic = Start
gm.Init()
gm.CustomRuntimeLogic = Game
GameMaster.SetupGameLoop(gm)

function Start() {
  // console.log("I play once at startup")
}

function Game() {
  // console.log("I play every frame")
}