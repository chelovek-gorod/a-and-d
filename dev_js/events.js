import { utils } from "pixi.js";

export const EventHub = new utils.EventEmitter()

export const events = {
    screenResize: 'screenResize',
    startTraining: 'startTraining',
    setHelpText: 'setHelpText',
    energyOnChange: 'energyOnChange',
    componentsOnChange: 'componentsOnChange',
    scienceOnChange: 'scienceOnChange',
    oreMiningChanged: 'oreMiningChanged',
    componentsMiningInfoChanged: 'componentsMiningInfoChanged',
    scienceMiningInfoChanged: 'scienceMiningInfoChanged',

    bombCarrierOnChange: 'bombCarrierOnChange',
    spiderOnChange: 'spiderOnChange',
    planeOnChange: 'planeOnChange',
    airshipOnChange: 'airshipOnChange',

    resetAddTower: 'resetAddTower',

    addTowerMiniMap: 'addTowerMiniMap',

    startAttackWave: 'startAttackWave',

    setBaseDamageFrom: 'setBaseDamageFrom',
}

export function screenResize( data ) {
    EventHub.emit( events.screenResize, data )
}

export function startTraining() {
    EventHub.emit( events.startTraining )
}

export function setHelpText( text ) {
    EventHub.emit( events.setHelpText, text )
}

export function energyOnChange() {
    EventHub.emit( events.energyOnChange )
}
export function componentsOnChange() {
    EventHub.emit( events.componentsOnChange )
}
export function scienceOnChange() {
    EventHub.emit( events.scienceOnChange )
}

export function oreMiningChanged() {
    EventHub.emit( events.oreMiningChanged )
}
export function componentsMiningChanged() {
    EventHub.emit( events.componentsMiningChanged )
}
export function scienceMiningChanged() {
    EventHub.emit( events.scienceMiningChanged )
}

export function bombCarrierOnChange() {
    EventHub.emit( events.bombCarrierOnChange )
}
export function spiderOnChange() {
    EventHub.emit( events.spiderOnChange )
}
export function planeOnChange() {
    EventHub.emit( events.planeOnChange )
}
export function airshipOnChange() {
    EventHub.emit( events.airshipOnChange )
}

export function resetAddTower(type) {
    EventHub.emit( events.resetAddTower, type )
} 

export function addTowerMiniMap(data) {
    EventHub.emit( events.addTowerMiniMap, data )
}

export function startAttackWave() {
    EventHub.emit( events.startAttackWave )
}

export function setBaseDamageFrom(enemy) {
    EventHub.emit( events.setBaseDamageFrom, enemy )
}

/*
USAGE

Init:
anyFunction( data )

Subscribe:
EventHub.on( events.eventKey, ( event ) => {
    // event actions 
})

*/

