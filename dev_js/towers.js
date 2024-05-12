import { TilingSprite, Sprite, Container, Text, AnimatedSprite, Graphics } from "pixi.js"
import { sprites, sounds } from "./loader"
import { textStyles } from "./fonts"
import { EventHub, events, setHelpText, resetAddTower, componentsOnChange } from './events'
import { state } from './state'
import { playSound } from './sound'
import { tickerAdd, tickerRemove, removeSprite } from "./application"
import { gameMap } from "./gameMap"
import { turnSpriteToTarget, moveSprite, getDistance, drawLightning } from './functions'
import Effect from "./effects"

const towerRadiusRate = 36

function getNearestEnemy(point) {
    let target = null
    let minDistance = Infinity
    gameMap.air.children.forEach( enemy => {
        let distance = getDistance(point, enemy)
        if(distance < minDistance) {
            minDistance = distance
            target = enemy
        }
    })
    gameMap.ground.children.forEach( enemy => {
        let distance = getDistance(point, enemy)
        if(distance < minDistance) {
            minDistance = distance
            target = enemy
        }
    })
    return target
}

class GatlingBullet extends Sprite {
    constructor(x, y, rotation) {
        super(sprites.player_blue.textures.tesla_top)
        this.anchor.set(0.5)
        this.position.x = x
        this.position.y = y
        this.rotation = rotation
        this.scale.set(0.25)
        this.speed = 12
        this.distance = state.player.defense.gatling.radius * towerRadiusRate
        this.power = {
            ground: state.player.defense.gatling.ground,
            air: state.player.defense.gatling.air,
        }
        gameMap.bullets.addChild(this)
        tickerAdd(this)
        playSound(sounds.shut)
    }

    tick(delta) {
        if (this.destroyed) return

        let pathSize = delta * this.speed
        moveSprite(this, pathSize)
        this.distance -= pathSize
        if (this.distance <= 0) this.delete()
    }

    delete() {
        tickerRemove(this)
        removeSprite(this)
    }
}

class RocketRocket extends Sprite {
    constructor(x, y, rotation) {
        super(sprites.player_blue.textures.rocket_rocket)
        this.anchor.set(0.5)
        this.position.x = x
        this.position.y = y
        this.rotation = rotation
        gameMap.bullets.addChild(this)
        tickerAdd(this)
        this.speed = 6
        this.turnSpeed = 0.1
        this.distance = state.player.defense.rocket.radius * towerRadiusRate
        this.power = {
            ground: state.player.defense.rocket.ground,
            air: state.player.defense.rocket.air,
        }
        this.isSmoke = true
        playSound(sounds.rocket)
    }

    tick(delta) {
        if (this.destroyed) return

        let pathSize = delta * this.speed
        moveSprite(this, pathSize)
        this.distance -= pathSize

        this.isSmoke = !this.isSmoke
        if(this.isSmoke) new Effect(this.position.x, this.position.y, 'smoke_32')

        if (this.distance <= 0) {
            this.delete()
        } else {
            let target = getNearestEnemy(this)
            if (target) turnSpriteToTarget(this, target, this.turnSpeed)
            else this.delete()
        }
    }

    delete() {
        tickerRemove(this)
        removeSprite(this)
    }
}

class TeslaShut extends Sprite {
    constructor(x, y, target) {
        super(sprites.player_blue.textures.tesla_top)
        this.anchor.set(0.5)
        this.position.x = x
        this.position.y = y
        this.target = target
        this.power = {
            ground: state.player.defense.tesla.ground,
            air: state.player.defense.tesla.air,
        }
        this.graphics = new Graphics()
        gameMap.bullets.addChild(this.graphics)
        this.duration = 15
        tickerAdd(this)
        this.isSmoke = false
        playSound(sounds.electro)
    }

    tick(delta) {
        if (this.destroyed) return

        if (this.target.destroyed) return this.delete()

        this.duration -= delta
        if (this.duration > 0) {
            drawLightning(this, this.target, this.graphics)
            this.isSmoke = !this.isSmoke
            if (this.isSmoke)new Effect(this.target.position.x, this.target.position.y, 'smoke_32')
        } else {
            this.target.setDamage( this.power[this.target.damageType] )
            this.delete()
        }
    }

    delete() {
        tickerRemove(this)
        removeSprite(this.graphics)
        removeSprite(this)
    }
}

class Gatling extends Sprite {
    constructor(x, y, type) {
        super(sprites.player_blue.textures.gatling_0)
        this.type = type
        this.position.x = x
        this.position.y = y
        this.init()
        this.radiusLine = new Graphics()
        this.radiusLine.position.set(this.position.x, this.position.y)
        gameMap.radiuses.addChild(this.radiusLine)
        gameMap.towers.addChild(this)
        this.offsetGun = 55
        this.isLeftGun = true
        this.images = ["gatling_0","gatling_1","gatling_2","gatling_3"]
        this.imageIndex = 0
    }

    shut() {
        const offsetAngle = (this.isLeftGun) ? this.rotation - Math.PI * 0.15 : this.rotation + Math.PI * 0.15
        const pointX = this.position.x + Math.cos(offsetAngle) * this.offsetGun
        const pointY = this.position.y + Math.sin(offsetAngle) * this.offsetGun

        new Effect(pointX, pointY, 'smoke_32')

        this.isLeftGun = !this.isLeftGun
        new GatlingBullet(pointX, pointY, this.rotation)
    }
}

class Rocket extends Sprite {
    constructor(x, y, type, gameMap) {
        super(sprites.player_blue.textures.rocket)
        this.type = type
        this.position.x = x
        this.position.y = y
        this.init()
        this.radiusLine = new Graphics()
        this.radiusLine.position.set(this.position.x, this.position.y)
        gameMap.radiuses.addChild(this.radiusLine)
        gameMap.towers.addChild(this)
        this.offsetGun = 40
        this.isLeftGun = true
    }

    shut() {
        const offsetAngle = (this.isLeftGun) ? this.rotation - Math.PI * 0.25 : this.rotation + Math.PI * 0.25
        const pointX = this.position.x + Math.cos(offsetAngle) * this.offsetGun
        const pointY = this.position.y + Math.sin(offsetAngle) * this.offsetGun

        new Effect(pointX, pointY, 'smoke_32')

        this.isLeftGun = !this.isLeftGun
        new RocketRocket(pointX, pointY, this.rotation)
    }
}


class Tesla extends Sprite {
    constructor(x, y, type, gameMap) {
        super(sprites.player_blue.textures.tesla)
        this.type = type
        this.position.x = x
        this.position.y = y
        this.init()
        this.radiusLine = new Graphics()
        this.radiusLine.position.set(this.position.x, this.position.y)
        gameMap.radiuses.addChild(this.radiusLine)
        gameMap.towers.addChild(this)

    }

    shut(target) {
        new TeslaShut(this.position.x, this.position.y, target)
    }
}

const towerMixin = {
    init() {
        this.anchor.set(0.5)
        if (this.type !== 'tesla') this.rotation = Math.random() * (Math.PI * 2)
        this.turnSpeed = (this.type !== 'tesla') ? 0.1 : Infinity
        this.scale.set(0.2)
        this.scaleSpeed = 0.02

        this.shutTimeout = 60 / state.player.defense[this.type].speed
        this.shutRadius = state.player.defense[this.type].radius * towerRadiusRate
        
        tickerAdd(this)

        this.eventMode = 'static'
        this.on('pointerenter', this.drawRadius.bind(this, true) )
        this.on('pointerleave', this.drawRadius.bind(this, false) )
    },

    drawRadius(isDraw) {
        this.radiusLine.clear()
        if (!isDraw) return

        this.radiusLine.lineStyle(6, 0xff0000, 0.75);
        this.radiusLine.beginFill(0xffff00, 0.25);
        this.radiusLine.drawCircle(0, 0, state.player.defense[this.type].radius * towerRadiusRate)
    },

    tick(delta) {
        if (this.scale.x < 1) {
            let scale = this.scale.x += this.scaleSpeed * delta
            if (scale > 1) scale = 1
            this.scale.x = scale
            this.scale.y = scale
        }
        
        let target = getNearestEnemy(this)
        if (target) {
            if (this.type !== 'tesla') turnSpriteToTarget(this, target, this.turnSpeed)

            if (getDistance(this, target) < this.shutRadius) {
                this.shutRadius = state.player.defense[this.type].radius * towerRadiusRate
            }
 
            this.shutTimeout -= delta
            if (this.shutTimeout <= 0) {
                this.shutTimeout = 60 / state.player.defense[this.type].speed

                if (getDistance(this, target) < this.shutRadius) {
                    if (this.type === 'gatling') {
                        this.imageIndex++
                        if (this.imageIndex === this.images.length) this.imageIndex = 0
                        this.texture = sprites.player_blue.textures[ this.images[this.imageIndex] ]
                    }
                    this.shut(target)
                    this.shutRadius = state.player.defense[this.type].radius * towerRadiusRate
                }
            }
        }
    }
}

Object.assign(Gatling.prototype, towerMixin)
Object.assign(Rocket.prototype, towerMixin)
Object.assign(Tesla.prototype, towerMixin)

export function buildTower(type, x, y, gameMap) {
    switch(type) {
        case 'gatling' : return new Gatling(x, y, type, gameMap);
        case 'rocket' : return new Rocket(x, y, type, gameMap);
        case 'tesla' : return new Tesla(x, y, type, gameMap);
    }
}