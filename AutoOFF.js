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

    let units = getUnits()

    units.axe.setMaxInputValWithOffset(300)
    units.spy.setInputVal(5)
    units.light.setMaxInputValWithOffset(200)
    units.marcher.setMaxInputVal()
    units.ram.setMaxInputValWithOffset(10)
    units.catapult.setInputVal(4)
})();
