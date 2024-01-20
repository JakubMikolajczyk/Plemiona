// ==UserScript==
// @name         Auto Fake Gruby
// @namespace    http://tampermonkey.net/
// @version      2024-01-20
// @description  try to take over the world!
// @author       Jakub Mikolajczyk
// @downloadURL  https://github.com/JakubMikolajczyk/Plemiona/raw/master/AutoFakeGruby.user.js
// @updateURL    https://github.com/JakubMikolajczyk/Plemiona/raw/master/AutoFakeGruby.user.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @match        https://*.plemiona.pl/game.php?*&screen=place
// @match        https://*.plemiona.pl/game.php?*&screen=place*
// @match        https://*.plemiona.pl/game.php?screen=place
// ==/UserScript==

class Unit{
 constructor(input){
 this.input = input
 }

    getMaxVal(){
     return this.input.attr('data-all-count')
    }

    setInputVal(val){
    this.input.val(Math.min(this.getMaxVal(), Math.max(0, Math.ceil(val))))
    }

    setMaxInputVal(){
        this.setInputVal(this.getMaxVal())
    }

    setMaxInputValWithOffset(offset){
        this.setInputVal(this.getMaxVal() - offset)
    }

    getInputVal(){
        return Number(this.input.val())    }

    addToInputVal(val){
     let prev = this.getInputVal()
     this.setInputVal(prev + val)
     let newVal = this.getInputVal()
     return newVal - prev
    }
}

function getUnits(){

    let units = {}
    game_data.units.forEach(unit => {
            units[unit] = new Unit($(`#unit_input_${unit}`))
    })
    return units
}

(function() {
    'use strict';
    let units = getUnits()

    units.spy.setInputVal(5)
    units.snob.setInputVal(1)

    let fake_limit = 80
    
    let axe_num = fake_limit/2
    let lk_num = fake_limit/8

    units.axe.setInputVal(axe_num)
    fake_limit -= units.axe.getInputVal()

    units.light.setInputVal(lk_num)
    fake_limit -= units.light.getInputVal() * 4

    if(fake_limit > 0){
        fake_limit -= units.axe.addToInputVal(fake_limit)
    }

    if(fake_limit > 0){
        fake_limit -= units.light.addToInputVal(fake_limit/4) * 4
    }

    if(fake_limit > 0 && (units.heavy.getMaxVal() - fake_limit/6) > 200){
        fake_limit -= units.heavy.addToInputVal(fake_limit/6) * 6
    }
})();
