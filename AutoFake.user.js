// ==UserScript==
// @name         Auto fake
// @namespace    http://tampermonkey.net/
// @version      2024-01-20
// @description  try to take over the world!
// @author       Jakub Mikolajczyk
// @downloadURL  https://github.com/JakubMikolajczyk/Plemiona/raw/master/AutoFake.user.js
// @updateURL    https://github.com/JakubMikolajczyk/Plemiona/raw/master/AutoFake.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
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
    let fake_limit = Math.ceil(game_data.village.points * 0.01)

    units.spy.setInputVal(5)
    fake_limit -= units.spy.getInputVal() * 2

    if(units.ram.getMaxVal() > 0){
        units.ram.setInputVal(1)
        fake_limit -= 5
    }
    else if (units.catapult.getMaxVal() > 0){
        units.catapult.setInputVal(1)
        fake_limit -= 8
    }


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

    if(fake_limit > 0 && (units.spy.getMaxVal() - fake_limit/2) > 50){
        fake_limit -= units.spy.addToInputVal(fake_limit/2) * 2
    }

    if(fake_limit > 0 && (units.heavy.getMaxVal() - fake_limit/6) > 200){
        fake_limit -= units.heavy.addToInputVal(fake_limit/6) * 6
    }

})();
