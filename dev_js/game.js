import { getAppScreen, Layer, removeSprite } from './application'
import GameMenu from './gameMenu'
import Background from './background'
import GameIU from './gameUI'
import GameMap from './gameMap'
import MiniMap from './miniMap'
import { smoothShowElement } from './functions'
import { playMusic, stopMusic, setMusicList } from './sound'
import { EventHub, events } from './events'
import FullScreenMessage from './fullscreen'
import Opponent from './training'
import ResultMenu from './resultMenu'
import { BombCarrier, Spider, Plane, Airship } from './army'
import { restartState } from './state'

let screenData, gameMenu, mainLayer, gameBackground, gameMap, gameUI, miniMap, resultMenu

export let isTraining = false
export let isResult = false

let bgSpriteName = 'background_tile_' + Math.ceil( Math.random() * 3 )
const mapScheme = [
    '--A--GG--A--',
    '------------',
    'A--xx--xx--A',
    '---xx--xx---',
    '------------',
    'G----BB----G',
    '---xxBbxx---',
]

function initGame() {
    
}

function resetGame() {

}

export function startGame() {
    restartState()
    screenData = getAppScreen()
    resultMenu = new ResultMenu( getAppScreen() )
    gameMenu = new GameMenu( screenData )

    gameMenu = new GameMenu( screenData )
    gameBackground = new Background( screenData, bgSpriteName )
    gameMap = new GameMap( screenData, mapScheme, bgSpriteName )
    miniMap = new MiniMap( mapScheme, bgSpriteName )
    gameUI = new GameIU( screenData, miniMap )
    
    mainLayer = new Layer()
    mainLayer.addChild( gameMenu )

    new FullScreenMessage(screenData, mainLayer)
    
    smoothShowElement( mainLayer, 'center', () => {
        // callback
    })
    
    setTimeout( () => setMusicList("menu"), 0 )

    EventHub.on( events.startTraining, startTraining )
    EventHub.on( events.showResults, showResults)
    EventHub.on( events.restartMenu, restartGame)
}

function startTraining() {
    isResult = false
    isTraining = true

    mainLayer.removeChild( gameMenu )

    mainLayer.addChild( gameBackground )
    mainLayer.addChild( gameMap )
    mainLayer.addChild( gameUI )

    let opponent = new Opponent()
    gameUI.start(opponent)
    setTimeout( () => setMusicList("game"), 0 )
}

function showResults(data) {
    isTraining = false
    isResult = true

    mainLayer.removeChild( gameBackground )
    mainLayer.removeChild( gameMap )
    mainLayer.removeChild( gameUI )
    
    resultMenu.update( data )
    mainLayer.addChild( resultMenu )

    setTimeout( () => setMusicList(data.isWin ? "win" : "lose"), 0 )
}

function changeBackground() {
    let bgIndex = +bgSpriteName[bgSpriteName.length - 1] + 1
    if (bgIndex > 3) bgIndex = 1
    bgSpriteName = 'background_tile_' + bgIndex
    gameBackground.setImage(bgSpriteName)
    miniMap.setBackgroundImage(bgSpriteName)
    miniMap.updateTrees(bgSpriteName)
    gameMap.updateTrees(bgSpriteName)
}

function restartGame() {
    restartState()
    changeBackground()
    mainLayer.removeChild(resultMenu)
    mainLayer.addChild( gameMenu )
    setTimeout( () => setMusicList("game"), 0 )
}

addEventListener('keyup', (event) => {
    console.log(event.code)

    switch( event.code ) {
        case 'KeyQ' : gameMap.ground.addChild( new BombCarrier( gameMap.getStartPoint('ground'), 'player_red', gameMap, 'opponent') ); break;
        case 'KeyW' : gameMap.ground.addChild( new Spider( gameMap.getStartPoint('ground'), 'player_red', gameMap, 'opponent') ); break;
        case 'KeyE' : gameMap.air.addChild( new Plane( gameMap.getStartPoint('air'), 'player_red', gameMap, 'opponent') ); break;
        case 'KeyR' : gameMap.air.addChild( new Airship( gameMap.getStartPoint('air'), 'player_red', gameMap, 'opponent') ); break;

        case 'Digit1' : miniMap.ground.addChild( new BombCarrier( miniMap.getStartPoint('ground'), 'player_blue', miniMap, 'player') ); break;
        case 'Digit2' : miniMap.ground.addChild( new Spider( miniMap.getStartPoint('ground'), 'player_blue', miniMap, 'player') ); break;
        case 'Digit3' : miniMap.air.addChild( new Plane( miniMap.getStartPoint('air'), 'player_blue', miniMap, 'player') ); break;
        case 'Digit4' : miniMap.air.addChild( new Airship( miniMap.getStartPoint('air'), 'player_blue', miniMap, 'player') ); break;

        case 'KeyZ' : showResults( {isWin: false, isBaseDestroyed: true, playerOreMinded: 110, opponentOreMiOreMinded: 120} ); break;
        case 'KeyX' : showResults( {isWin: false, isBaseDestroyed: false, playerOreMinded: 110, opponentOreMiOreMinded: 120} ); break;
        case 'KeyC' : showResults( {isWin: true, isBaseDestroyed: true, playerOreMinded: 110, opponentOreMiOreMinded: 120} ); break;
        case 'KeyV' : showResults( {isWin: true, isBaseDestroyed: false, playerOreMinded: 130, opponentOreMiOreMinded: 120} ); break;

        case 'KeyB' : changeBackground(); break;
    }
})
