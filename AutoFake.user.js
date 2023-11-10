// ==UserScript==
// @name         Auto fake
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/game.php?*&screen=place
// @match        https://*.plemiona.pl/game.php?*&screen=place*
// @match        https://*.plemiona.pl/game.php?screen=place
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @downloadURL  https://github.com/JakubMikolajczyk/Plemiona/raw/master/AutoFake.user.js
// @updateURL    https://github.com/JakubMikolajczyk/Plemiona/raw/master/AutoFake.user.js
// @grant        none
// ==/UserScript==

let ignore = ['spear', 'sword', 'archer', 'marcher', 'knight', 'militia', 'snob']

let population = {
    "axe": 1,
    "spy": 2,
    "light": 4,
    "heavy": 6,
    "ram": 5,
    "catapult": 8
}


let fake_limit

function getInputs(){

    let inputs = {}
    game_data.units.forEach(unit => {
        if (!ignore.includes(unit))
            inputs[unit] = $(`#unit_input_${unit}`)
    })
      return inputs
}

(function() {
    'use strict';

    let inputs = getInputs()
    fake_limit = Math.ceil(game_data.village.points * 0.01)
    console.log(inputs)

    if(inputs["ram"].attr('data-all-count') > 0){
        inputs["ram"].val(1)
        fake_limit -= population["ram"]
    }
    else{
        inputs["catapult"].val(1)
        fake_limit -= population["catapult"]
    }

    let spyNum = Math.min(inputs["spy"].attr('data-all-count'), 5)
    inputs["spy"].val(spyNum)
    fake_limit -= population["spy"] * spyNum

    console.log(fake_limit)

    let pop = inputs["axe"].attr('data-all-count') * population["axe"] +
        inputs["light"].attr('data-all-count') * population["light"]

    if(inputs["heavy"].attr('data-all-count') > 1000){
        pop += inputs["heavy"].attr('data-all-count') * population["heavy"]

        let ckNum = Math.ceil(inputs["heavy"].attr('data-all-count') * population["heavy"] / pop * fake_limit /population["heavy"])
        inputs["heavy"].val(ckNum)
    }

    console.log(fake_limit)

    let axeNum = Math.ceil(inputs["axe"].attr('data-all-count') * population["axe"] / pop * fake_limit/population["axe"])
        inputs["axe"].val(axeNum)

    console.log(fake_limit)

    let lkNum = Math.ceil(inputs["light"].attr('data-all-count') * population["light"] / pop * fake_limit/population["light"])
        inputs["light"].val(lkNum)

    console.log(fake_limit)
   // let inputs = getInputs()
   // console.log(inputs)
   // inputs["spy"].val(20)
})();
