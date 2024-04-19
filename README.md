# Game Template (Three.js)
## Install
## How to use
```
let gm = new GameMaster.GameMaster(window)
gm.CustomStartupLogic = Start
gm.CustomRuntimeLogic = Game
gm.Init()
GameMaster.SetupGameLoop(gm)

function Start() {
  // I run once at startup
}

function Game() {
  // I run every frame
}
```

## API 
### functions:
 - SetupGameLoop(GameMaster obj) : Sets window interval to execute game loop every FRAME_TIME

### GameMaster class
consts:
 - FRAME_TIME = 0.1 # Desired time between frames (seconds)
vars:
 - ```mainCamera``` : Camera used in render() call
 - ```renderer``` : Renderer used to render() 
 - ```scene``` : Scene used in render() 
 - ```tloader``` : Texture Loader
 - ```originToCam``` : (three.js Vector2) theta (angle from xaxis) and phi (angle of yaxis)

 # game loop
 - ```prevRender``` : Time of previous frame render (ms)
 - ```startTime``` : When game was initialized
 - ```frameDelta``` : Time taken to render previous scene

 - ```CustomStartupLogic``` : Custom logic to run at startup (user function)
 - ```CustomRuntimeLogic``` : Custom logic to run in the game loop (user function)

func:
 - ```Init()``` : initializes class variables
