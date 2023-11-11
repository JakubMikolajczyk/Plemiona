// ==UserScript==
// @name         Auto Fake Gruby
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/game.php?*&screen=place
// @match        https://*.plemiona.pl/game.php?*&screen=place*
// @match        https://*.plemiona.pl/game.php?screen=place
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// ==/UserScript==

class Unit{
 constructor(input){
 this.input = input
 }

    getMaxVal(){
     return this.input.attr('data-all-count')
    }

    setInputVal(val){
    this.input.val(Math.min(this.getMaxVal(), Math.max(0, val)))
    }

    setMaxInputVal(){
        this.setInputVal(this.getMaxVal())
    }

    setMaxInputValWithOffset(offset){
        this.setInputVal(this.getMaxVal() - offset)
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

 console.log("!#@!$")
    let units = getUnits()

    units.spy.setInputVal(6)
    units.snob.setInputVal(1)
})();
