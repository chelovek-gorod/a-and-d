import { Sprite, AnimatedSprite, Graphics } from "pixi.js"
import { sprites, sounds } from "./loader"
import { setBaseDamageFrom } from './events'
import { state } from './state'
import { playSound } from './sound'
import { tickerAdd, tickerRemove, removeSprite } from "./application"
import { gameMap } from "./gameMap"
import { turnSpriteToTarget, moveSprite, getDistance } from './functions'
import Effect from "./effects"

const baseDistance = 100
const speedRate = 0.2
const shadowOffsetY = 64

export class BombCarrier extends AnimatedSprite {
    constructor(startPoint, sprite_atlas, target, owner) {
        super(sprites[sprite_atlas].animations.bomb_carrier)
        if (sprite_atlas.indexOf('red') >= 0) gameMap.ground.addChild(this)
        this.animationSpeed = 0.5
        this.play()
        this.init('bombCarrier', startPoint, owner, target)
        this.size = 48
        this.damageType = 'ground'
    }
}

export class Spider extends AnimatedSprite {
    constructor(startPoint, sprite_atlas, target, owner) {
        super(sprites[sprite_atlas].animations.spider)
        turnSpriteToTarget(this, target, Infinity)
        if (sprite_atlas.indexOf('red') >= 0) gameMap.ground.addChild(this)
        this.animationSpeed = 0.5
        this.play()
        this.init('spider', startPoint, owner, target)
        this.size = 16
        this.damageType = 'ground'
    }
}

export class Plane extends Sprite {
    constructor(startPoint, sprite_atlas, target, owner) {
        super(sprites[sprite_atlas].textures.plane)
        if (sprite_atlas.indexOf('red') >= 0) gameMap.ground.addChild(this)
        this.init('plane', startPoint, owner, target)
        this.size = 32
        this.damageType = 'air'

        this.shadow = new Sprite(sprites[sprite_atlas].textures.plane_shadow)
        this.shadow.anchor.set(0.5)
        this.shadow.position.x = startPoint.x
        this.shadow.position.y = startPoint.y + shadowOffsetY
        turnSpriteToTarget(this.shadow, target, Infinity)
        gameMap.shadows.addChild(this.shadow)
    }
}

export class Airship extends Sprite {
    constructor(startPoint, sprite_atlas, target, owner) {
        super(sprites[sprite_atlas].textures.airship)
        if (sprite_atlas.indexOf('red') >= 0) gameMap.ground.addChild(this)
        this.init('airship', startPoint, owner, target)
        this.size = 64
        this.damageType = 'air'

        this.shadow = new Sprite(sprites[sprite_atlas].textures.airship_shadow)
        this.shadow.anchor.set(0.5)
        this.shadow.position.x = startPoint.x
        this.shadow.position.y = startPoint.y + shadowOffsetY
        turnSpriteToTarget(this.shadow, target, Infinity)
        gameMap.shadows.addChild(this.shadow)
    }
}

const armyMixin = {
    init(type, startPoint, owner, target) {
        this.anchor.set(0.5)
        this.position.x = startPoint.x
        this.position.y = startPoint.y
        turnSpriteToTarget(this, target, Infinity)

        this.hp = 100
        this.speed = state[owner].attack[type].speed * speedRate
        this.armor = state[owner].attack[type].armor
        this.power = state[owner].attack[type].power
        this.target = target
        this.owner = owner

        tickerAdd(this)

        this.hpBar = new Graphics()
        gameMap.markers.addChild(this.hpBar)
    },
    
    tick(delta) {
        if (this.destroyed) return

        this.hpBar.clear()
        this.hpBar.beginFill(0xff0000)
        this.hpBar.drawRect(this.position.x - 25, this.position.y - 50, 50, 5)
        this.hpBar.endFill()
        this.hpBar.beginFill(0x00ff00)
        this.hpBar.drawRect(this.position.x - 25, this.position.y - 50, this.hp * 0.5, 5)
        this.hpBar.endFill()

        moveSprite(this, this.speed * delta)
        if ( getDistance(this, this.target) < baseDistance ) return this.delete(true)
        if (this.damageType === 'air') {
            this.shadow.position.x = this.position.x
            this.shadow.position.y = this.position.y + shadowOffsetY
        }
        
        gameMap.bullets.children.forEach( bullet => {
            if ( getDistance(this, bullet) < this.size ) {
                this.hp -= bullet.power[this.damageType] / this.armor
                new Effect(bullet.position.x, bullet.position.y, 'explosion_64')
                playSound(sounds.hit)
                bullet.delete()
            }
        })
        if (this.hp <= 0) this.delete()
    },

    setDamage(damage, x, y) {
        this.hp -= damage / this.armor
        new Effect(this.position.x, this.position.y, 'explosion_64')
        playSound(sounds.hit)
        if (this.hp <= 0) this.delete()
    },

    delete(isAddDamage = false) {
        if(isAddDamage) {
            const target = this.owner === 'opponent' ? 'player' : 'opponent'
            state[target].defense.base.hp -= this.power
            if (state[target].defense.base.hp < 0) state[target].defense.base.hp = 0
            setBaseDamageFrom(this.owner)
            new Effect(this.position.x, this.position.y, 'explosion_240')
        } else {
            new Effect(this.position.x, this.position.y, 'explosion_192')
        }
        playSound(sounds.explosion)
        if (this.damageType === 'air') removeSprite(this.shadow)
        removeSprite(this.hpBar)
        tickerRemove(this)
        removeSprite(this)
    }
}

Object.assign(BombCarrier.prototype, armyMixin)
Object.assign(Spider.prototype, armyMixin)
Object.assign(Plane.prototype, armyMixin)
Object.assign(Airship.prototype, armyMixin)