// ==UserScript==
// @name         Auto mass scavenge
// @namespace    http://tampermonkey.net/
// @version      2024-09-20
// @description  try to take over the world!
// @author       Jakub Mikolaczyk
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @match        https://*.plemiona.pl/game.php?*&screen=place&mode=scavenge_mass
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fill(unit, number) {
    let field = $(`[name=${unit}]`);
    field.trigger('focus');
    field.trigger('keydown');
    field.val(number);
    field.trigger('keyup');
    field.trigger('change');
    field.blur();
}

function fillUnits(i) {
    let spear = [264, 278, 246, 211]
    fill("spear", spear[i])
}

function convertToSeconds(time) {
    const [hours, minutes, seconds] = time.split(":")
    return (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds)
}
class Option
{
    constructor(index, selectAll) {
        this.index = index
        this.selectAll = selectAll
        this.option = document.querySelector(`.option.option-${index + 1}.option-active`)
    }

    isActive()
    {
        return this.option != null
    }

    async send()
    {
        console.log("Sending: " + this.index)
        fillUnits(this.index)
        this.selectAll.click()
        document.querySelector(".btn.btn-default.btn-send").click()
        await sleep(500)
        this.option = document.querySelector(`.option.option-${this.index + 1}.option-active`)
    }

    async getTimer() {
        console.log("OPTION:" + this.option)
        let time = null
        let img = this.option.getElementsByTagName("img")[0]
        await sleep(Math.random() * 300 + 700)
        console.log("GetTimer img", img)
        img.dispatchEvent(new Event('mouseover'))
        let tooltip = document
            .querySelector("#tooltip")
        console.log("GetTimer tooltip", tooltip)
        let spans = tooltip
            .getElementsByTagName("div")[0]
            .getElementsByTagName("span")
        console.log("GetTimer spans" , spans)
        time = spans[spans.length - 1].innerText
        console.log("GetTimer time" , time)
        return convertToSeconds(time)
    }
}

class Manager
{
    constructor()
    {
        this.selectAll = document.querySelectorAll(".select-all-col")
        this.options = []
        for(let i = 0; i < 4; i++)
            this.options[i] = new Option(i, this.selectAll[i])
        this.options.reverse()
    }

    async run() {
        await this.sendInactive()
        console.log("GOING TO WAITING PHASE")
        await this.waitForActive()
    }

    async sendInactive()
    {
        for (const option of this.options) {
            if(!option.isActive()){
                await option.send()
                await sleep(1000)
            }
        }
    }

    async waitForActive() {
        let waitingTimer = await this.getMinTimer() + Math.random() * 30 + 10
        console.log("WAITING: ", waitingTimer)
        await sleep(1000 * waitingTimer)
        location.reload()
    }

    async getMinTimer() {
        let min = 999999999999999999
        for (const option of this.options) {
            if(option.isActive()){
                let timer = await option.getTimer()
                if (timer < min)
                    min = timer
            }
        }

        return min
    }
}

function main()
{
    let manager = new Manager()
    manager.run().then(r => console.log("lol"))
}

setTimeout(main, 200)