import { getAppScreen, Layer } from './application'
import GameMenu from './gameMenu'
import Background from './background'
import GameIU from './gameUI'
import GameMap from './gameMap'
import { smoothShowElement } from './functions'
import { playMusic, stopMusic, setMusicList } from './sound'
import { EventHub, events } from './events'
import FullScreenMessage from './fullscreen'
import Opponent from './training'
import { BombCarrier, Spider, Plane, Airship } from "./army"

let screenData, gameMenu, mainLayer, gameBackground, gameMap, gameUI, miniMap

export function startGame() {
    screenData = getAppScreen()

    const bgSpriteName = 'background_tile_' + Math.ceil( Math.random() * 3 )
    const mapScheme = [
        '--A--GG--A--',
        '------------',
        'A--xx--xx--A',
        '---xx--xx---',
        '------------',
        'G----BB----G',
        '---xxBbxx---',
    ]

    gameMenu = new GameMenu( screenData )
    gameBackground = new Background( screenData, bgSpriteName )
    gameMap = new GameMap( screenData, mapScheme, bgSpriteName )
    gameUI = new GameIU( screenData, mapScheme, bgSpriteName )
    
    mainLayer = new Layer()
    mainLayer.addChild( gameMenu )

    new FullScreenMessage(screenData, mainLayer)
    
    smoothShowElement( mainLayer, 'center', () => {
        // callback
    })
    
    setMusicList("menu")

    EventHub.on( events.startTraining, startTraining )
}

function startTraining() {
    mainLayer.removeChild( gameMenu )

    mainLayer.addChild( gameBackground )
    mainLayer.addChild( gameMap )
    mainLayer.addChild( gameUI )

    let opponent = new Opponent()
    gameUI.start(opponent)
    setMusicList("game")
}

addEventListener('keyup', (event) => {
    console.log(event.code)

    switch( event.code ) {
        case 'KeyQ' : gameMap.ground.addChild( new BombCarrier( gameMap.getStartPoint('ground'), 'player_red', gameMap.base, 'opponent') ); break;
        case 'KeyW' : gameMap.ground.addChild( new Spider( gameMap.getStartPoint('ground'), 'player_red', gameMap.base, 'opponent') ); break;
        case 'KeyE' : gameMap.air.addChild( new Plane( gameMap.getStartPoint('air'), 'player_red', gameMap.base, 'opponent') ); break;
        case 'KeyR' : gameMap.air.addChild( new Airship( gameMap.getStartPoint('air'), 'player_red', gameMap.base, 'opponent') ); break;
    }
})