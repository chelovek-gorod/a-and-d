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

    addTowerOnMiniMap: 'addTowerOnMiniMap',

    startAttackWave: 'startAttackWave',

    setBaseDamageFrom: 'setBaseDamageFrom',

    playerTowerUpgrade: 'playerTowerUpgrade',
    opponentTowerUpgrade: 'opponentTowerUpgrade',

    showResults: 'showResults',

    restartMenu: 'restartMenu',
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

export function addTowerOnMiniMap(data) {
    EventHub.emit( events.addTowerOnMiniMap, data )
}

export function startAttackWave() {
    EventHub.emit( events.startAttackWave )
}

export function setBaseDamageFrom(enemy) {
    EventHub.emit( events.setBaseDamageFrom, enemy )
}

export function playerTowerUpgrade() {
    EventHub.emit( events.playerTowerUpgrade )
}
export function opponentTowerUpgrade() {
    EventHub.emit( events.opponentTowerUpgrade )
}

export function showResults(data) {
    EventHub.emit( events.showResults, data )
}

export function restartMenu() {
    EventHub.emit( events.restartMenu )
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

