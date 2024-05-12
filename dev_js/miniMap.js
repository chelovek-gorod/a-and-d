import { TilingSprite, Sprite, Container, Graphics } from "pixi.js"
import { sprites, sounds } from "./loader"
import { EventHub, events, addTowerMiniMap } from './events'
import { state } from './state'

const settings = {
    scaledWidth: 280,
    scaledHeight: 210,
    scaleRate: 0.25,

    width: 0,
    height: 0,

    ceilSize: 96,
    ceilHalfSize: 48,
}
settings.width = settings.scaledWidth / settings.scaleRate
settings.height = settings.scaledHeight / settings.scaleRate

class Slot extends Sprite {
    constructor(x, y, parentLayer) {
        super(sprites.slot.textures[0]) // 23 - with tower
        this.anchor.set(0.5)
        this.position.x = x + settings.ceilHalfSize
        this.position.y = y + settings.ceilHalfSize
        this.index = parentLayer.children.length
        parentLayer.addChild(this)
    }
}

class Base extends Sprite {
    constructor(x, y, parentLayer) {
        super(sprites.base_red.textures[0])
        this.anchor.set(0.5)
        this.position.x = x + settings.ceilSize
        this.position.y = y + settings.ceilSize
        parentLayer.addChild(this)
    }
}

class MiniMap extends Container {
    constructor(mapScheme, bgSpriteName) {
        super()

        this.width = settings.width
        this.height = settings.height

        this.scale.x = settings.scaleRate
        this.scale.y = settings.scaleRate
        
        this.maskBorder = new Graphics()
        this.maskBorder.beginFill()
        this.maskBorder.drawRoundedRect( -settings.width * 0.5, -settings.height + 24, settings.width, settings.height, 48 )
        this.maskBorder.endFill()
        this.addChild(this.maskBorder)
        this.mask = this.maskBorder

        this.background = new TilingSprite( sprites[bgSpriteName] )
        this.background.width = settings.width
        this.background.height = settings.height
        this.background.position.x = -settings.width * 0.5
        this.background.position.y = -settings.height + 24
        this.addChild(this.background)

        this.airLayer = new Container()
        this.groundLayer = new Container()
        this.towersLayer = new Container()
        this.slotsLayer = new Container()
        this.baseLayer = new Container()

        this.addChild(this.baseLayer, this.slotsLayer, this.towersLayer, this.groundLayer, this.airLayer)

        this.base = null

        const startX = -(mapScheme[0].length * settings.ceilSize * 0.5) 
        const startY = -(mapScheme.length * settings.ceilSize)

        for(let line = 0; line < mapScheme.length; line++) {
            for(let index = 0; index < mapScheme[line].length; index++) {
                const pointX = startX + index * settings.ceilSize
                const pointY = startY + line * settings.ceilSize

                switch(mapScheme[line][index]) {
                    case 'x' : new Slot(pointX, pointY, this.slotsLayer); break;
                    case 'B' : if (this.base === null) this.base = new Base(pointX, pointY, this.baseLayer); break;
                }
            }
        }

        EventHub.on( events.addTowerMiniMap, this.addTower.bind(this) )
    }

    addTower(data) {
        const spriteImage = (data.type === 'gatling') ? sprites.player_red.textures.gatling_0 : sprites.player_red.textures[data.type]
        const tower = new Sprite(spriteImage)
        tower.anchor.set(0.5)
        tower.rotation = (data.type === 'tesla') ? 0 : -Math.PI * 0.25
        tower.position.x = this.slotsLayer.children[data.index].position.x
        tower.position.y = this.slotsLayer.children[data.index].position.y
        this.towersLayer.addChild(tower)
    }
}

export default MiniMap
