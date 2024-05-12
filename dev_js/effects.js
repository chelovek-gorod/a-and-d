import { AnimatedSprite } from "pixi.js"
import { sprites, sounds } from "./loader"
import { playSound } from './sound'
import { removeSprite } from "./application"
import { gameMap } from "./gameMap"

class Effect extends AnimatedSprite {
    constructor(x, y, effect) {
        super(sprites[effect].animations.effect)
        this.anchor.set(0.5)
        this.position.x = x
        this.position.y = y
        gameMap.effects.addChild(this)
        this.onLoop = () => removeSprite(this)
        //this.animationSpeed = 0.5
        this.play()
    }
}

export default Effect