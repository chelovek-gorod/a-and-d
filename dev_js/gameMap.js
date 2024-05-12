import { TilingSprite, Sprite, Container, Text, AnimatedSprite } from "pixi.js"
import { sprites, sounds } from "./loader"
import { textStyles } from "./fonts"
import { EventHub, events, setHelpText, resetAddTower, componentsOnChange } from './events'
import { state } from './state'
import { playSound } from './sound'
import { tickerAdd, tickerRemove } from "./application"
import { buildTower } from "./towers"
import { BombCarrier, Spider, Plane, Airship } from "./army"

const settings = {
    sidebarBottomHeight: 38,
    sidebarRightWidth: 320,
    sidebarTopHeight: 112,

    ceilSize: 96,
    ceilHalfSize: 48,
}

export let gameMap = null
export const buildInfo = {
    type: '',
    price: 0,
    isActive: false,

    reset() {
        resetAddTower(this.type)
        this.type = ''
        this.price = 0
        this.isActive = false
        gameMap.slots.children.forEach( slot => { if (slot.isEmpty) slot.pointer.hide() } )
    },

    setTower(type, price) {
        this.type = type
        this.price = price
        if (!this.isActive) {
            this.isActive = true
            gameMap.slots.children.forEach( slot => { if (slot.isEmpty) slot.pointer.show() } )
        }
    }
}

const towersToBuildList = []

let trees = []
let treeIndex = 0

function setTrees(bgName) {
    if (bgName === 'background_tile_1') trees = [1, 2, 3]
    else if (bgName === 'background_tile_3') trees = [4, 5]
    else trees = [6]
}

let treeSteps = Math.ceil(Math.random() * 5)

function addTree(x, y) {
    treeSteps--
    if (treeSteps === 0) {
        treeSteps = 3 + Math.floor(Math.random() * 5)

        treeIndex++
        if (treeIndex === trees.length) treeIndex = 0

        new Tree(x, y, trees[treeIndex])
    }
}

class Tree extends Sprite {
    constructor(x, y, treeIndex) {
        super(sprites[`tree_${treeIndex}`])
        this.anchor.set(0.5)
        this.position.x = x
        this.position.y = y
        this.rotation = Math.random() * (Math.PI * 2)
        gameMap.trees.addChild(this)
    }
}

class StartPoint extends AnimatedSprite {
    constructor (x, y) {
        super(sprites.star_flash.animations.flash)
        this.anchor.set(0.5)
        this.position.x = x + settings.ceilHalfSize
        this.position.y = y + settings.ceilHalfSize
        this.animationSpeed = 0.5
        this.play()
        gameMap.markers.addChild(this)
    }
}

class Base extends AnimatedSprite {
    constructor(x, y) {
        super(sprites.base_blue.animations.build)
        this.anchor.set(0.5)
        this.position.x = x + settings.ceilSize
        this.position.y = y + settings.ceilSize
        this.isOnBuild = false
        this.animationSpeed = 0.75
        this.onLoop = this.buildComplete.bind(this)
        gameMap.baseContainer.addChild(this)
    }

    build() {
        if (this.isOnBuild) return

        this.isOnBuild = true
        this.play()
        playSound(sounds.build)
    }

    buildComplete() {
        const buildData = towersToBuildList.shift()
        gameMap.slots.children[buildData.slotIndex].buildTower(buildData.towerType)

        if (towersToBuildList.length === 0) {
            this.stop()
            this.isOnBuild = false
        }
    }
}

class SlotPointer extends Sprite {
    constructor(x, y) {
        super(sprites.slot_pointer)
        this.anchor.set(0.5)
        this.alpha = 0
        this.rotation = 0
        this.position.x = x
        this.position.y = y
        this.rotationSpeed = 0.03
        this.scaleSpeed = 0.02
        this.isScaleUp = false
    }

    show() {
        this.alpha = 1
        tickerAdd(this)
    }
    hide() {
        this.alpha = 0
        tickerRemove(this)
    }
    tick(delta) {
        this.rotation += this.rotationSpeed * delta
        let scale = (this.isScaleUp) ? this.scale.x + this.scaleSpeed  * delta : this.scale.x - this.scaleSpeed  * delta
        this.scale.x = scale
        this.scale.y = scale
        if (scale > 1) this.isScaleUp = false
        if (scale < 0.5) this.isScaleUp = true
    }
}

class Slot extends AnimatedSprite {
    constructor(x, y) {
        super(sprites.slot.animations.open)
        this.anchor.set(0.5)
        this.position.x = x + settings.ceilHalfSize
        this.position.y = y + settings.ceilHalfSize
        this.pointer = new SlotPointer(x + settings.ceilHalfSize, y + settings.ceilHalfSize)
        this.isEmpty = true
        this.index = gameMap.slots.children.length
        this.loop = false
        this.animationSpeed = 0.75
        gameMap.slots.addChild(this)
        gameMap.markers.addChild(this.pointer)

        this.eventMode = 'static'
        this.on('pointertap', this.build.bind(this))
    }

    build() {
        if (!buildInfo.isActive || !this.isEmpty) return

        towersToBuildList.push({towerType: buildInfo.type, slotIndex: this.index})

        state.player.components.count -= state.player.defense[buildInfo.type].price
        componentsOnChange()

        buildInfo.reset()
        this.isEmpty = false
        gameMap.base.build()
    }

    buildTower(type) {
        this.play()
        this.onComplete = this.buildComplete.bind(this, type)
    }

    buildComplete(type) {
        buildTower(type, this.position.x, this.position.y, gameMap)
        this.textures = sprites.slot.animations.close
        this.onComplete = null
        this.animationSpeed = 0.25
        this.play()
    }
}

class GameMap extends Container {
    constructor(screenData, mapScheme, bgName) {
        super()
        gameMap = this
        this.markers = new Container()
        this.air = new Container()
        this.bullets = new Container()
        this.effects = new Container()
        this.trees = new Container()
        this.towers = new Container()
        this.radiuses = new Container()
        this.shadows = new Container()
        this.ground = new Container()
        this.slots = new Container()
        this.baseContainer = new Container()

        this.addChild(this.baseContainer, this.slots, this.ground, this.shadows, this.radiuses, this.towers,
            this.trees, this.bullets, this.air, this.effects, this.markers)

        this.base = null
        this.airStartPoints = []
        this.groundStartPoints = []
        this.attackers = []
        
        setTrees(bgName)

        const startX = -(mapScheme[0].length * settings.ceilSize * 0.5) 
        const startY = -(mapScheme.length * settings.ceilSize)

        for(let line = 0; line < mapScheme.length; line++) {
            for(let index = 0; index < mapScheme[line].length; index++) {
                const pointX = startX + index * settings.ceilSize
                const pointY = startY + line * settings.ceilSize

                if (mapScheme[line][index] !== 'b') addTree(pointX, pointY)
                if (index === mapScheme[line].length - 1) addTree(pointX + settings.ceilSize, pointY)
                if (line === mapScheme.length - 1) {
                    addTree(pointX, pointY + settings.ceilSize)
                    if (index === mapScheme[line].length - 1) addTree(pointX + settings.ceilSize, pointY + settings.ceilSize)
                }

                switch(mapScheme[line][index]) {
                    case 'A' : this.airStartPoints.push( new StartPoint(pointX, pointY) ); break;
                    case 'G' : this.groundStartPoints.push( new StartPoint(pointX, pointY) ); break;
                    case 'x' : new Slot(pointX, pointY); break;
                    case 'B' : if (this.base === null) this.base = new Base(pointX, pointY); break;
                }
            }
        }

        this.airStartPointIndex = Math.floor( Math.random() * this.airStartPoints.length )
        this.groundStartPointIndex = Math.floor( Math.random() * this.groundStartPoints.length )

        this.screenResize( screenData )
        EventHub.on( events.screenResize, this.screenResize.bind(this) )

        EventHub.on( events.startAttackWave, this.startAttackWave.bind(this) )
    }

    screenResize(screenData) {
        this.position.x = (screenData.width - settings.sidebarRightWidth) * 0.5
        this.position.y = screenData.height - settings.sidebarBottomHeight - 24
    }

    startAttackWave() {
        for (let unitType in state.opponent.attack) {
            while (state.opponent.attack[unitType].count) {
                state.opponent.attack[unitType].count--
                this.attackers.push(unitType)
            }
        }
        if (this.attackers.length) this.attackers.sort(() => Math.random() - 0.5)
    }

    addAttacker() {
        switch( this.attackers.pop() ) {
            case 'bombCarrier' : this.ground.addChild( new BombCarrier( this.getStartPoint('ground'), 'player_red', this.base, 'opponent') ); break;
            case 'spider' : this.ground.addChild( new Spider( this.getStartPoint('ground'), 'player_red', this.base, 'opponent') ); break;
            case 'plane' : this.air.addChild( new Plane( this.getStartPoint('air'), 'player_red', this.base, 'opponent') ); break;
            case 'airship' : this.air.addChild( new Airship( this.getStartPoint('air'), 'player_red', this.base, 'opponent') ); break;
        }
    }

    getStartPoint( type = 'ground' ) {
        if (type === 'air') {
            this.airStartPointIndex++
            if (this.airStartPointIndex === this.airStartPoints.length) this.airStartPointIndex = 0

            return {
                x: this.airStartPoints[this.airStartPointIndex].position.x,
                y: this.airStartPoints[this.airStartPointIndex].position.y
            }
        } else {
            this.groundStartPointIndex++
            if (this.groundStartPointIndex === this.groundStartPoints.length) this.groundStartPointIndex = 0
            return {
                x: this.groundStartPoints[this.groundStartPointIndex].position.x,
                y: this.groundStartPoints[this.groundStartPointIndex].position.y
            }
        }
    }
}

export default GameMap