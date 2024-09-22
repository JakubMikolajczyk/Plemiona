// ==UserScript==
// @name         Auto scavenge
// @namespace    http://tampermonkey.net/
// @version      2024-09-20
// @description  try to take over the world!
// @author       Jakub Mikolaczyk
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @match        https://*.plemiona.pl/game.php?*&screen=place&mode=scavenge
// @match        https://*.plemiona.pl/game.php?*&screen=place*
// @match        https://*.plemiona.pl/game.php?screen=place&mode=scavenge
// ==/UserScript==

class scavengeWindow {

    constructor(window) {
        this.window = window
    }

    convertToSeconds(time) {
        const [hours, minutes, seconds] = time.split(":")
        return (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds)
    }

    getTimerValue() {
        let timer = this.window.querySelector(".return-countdown")
        if (timer == null)
            return 0
        return this.convertToSeconds(timer.innerHTML)
    }

    send(window) {
        setTimeout(_ => {
            this.window.querySelector(".btn.btn-default.free_send_button").click()
        }, Math.random() * 2000 + 1000)
    }

    isLocked(window) {
        return this.window.querySelector(".locked-view") != null
    }
}

function fill(unit, number) {
    let field = $(`[name=${unit}]`);
    let available = Number(field[0].parentNode.children[1].innerText.match(/\d+/)[0]);
    number = Math.min(number, available);
    field.trigger('focus');
    field.trigger('keydown');
    field.val(number);
    field.trigger('keyup');
    field.trigger('change');
    field.blur();
}

function fillUnits(i) {
    let spear = [573, 360, 0, 1]
    let axe = [405, 0, 1, 1]
    let light = [0, 67, 101, 67]
    fill("spear", spear[i])
    fill("axe", axe[i])
    fill("light", light[i])
}

function getWindows() {
    let windows = []
    document.querySelectorAll(".scavenge-option.border-frame-gold-red")
        .forEach(w => windows.push(new scavengeWindow(w)))
    return windows
}

function getMinWindowIndex(windows, ignoreIndex = -1) {
    let minIndex = -1
    let minTime = 99999999999999999
    for (let i = 0; i < windows.length; i++) {
        let win = windows[i]
        if (win.isLocked() || i === ignoreIndex)
            continue;
        let timer = win.getTimerValue()
        if (minTime < timer)
            continue
        minIndex = i
        minTime = timer
    }
    return minIndex;
}

function isZeroCapacity() {
    let capacity = document.querySelector(".carry-max")
    console.log("CAPACITY" + capacity.innerHTML)
    if (capacity.querySelector(".gray") != null)
        return false
    return capacity.innerHTML === "0"
}

function loop() {
    let windows = getWindows()
    if (windows.length === 0)
        return;
    let minIndex = getMinWindowIndex(windows)
    if (minIndex === -1)
        return

    let minWindow = windows[minIndex]
    let time = minWindow.getTimerValue() + 3
    if (time > 5)
        time += Math.floor(Math.random() * 30 + 10)
    console.log("WAITING TIME: " + time)
    console.log(minWindow.window)
    setTimeout(_ => {
        fillUnits(minIndex)
        if (!isZeroCapacity()) {
            minWindow.send()
            setTimeout(_ => location.reload(), 1000 * (Math.random() * 5 + 3))
        }
        else
        {
            let secWindow = windows[getMinWindowIndex(windows, minIndex)]
            let secTime = secWindow.getTimerValue() + Math.random() * 30 + 10
            console.log("WAITING FOR SECOND MIN" + secTime)
            console.log(secWindow.window)
            setTimeout(_ => location.reload(), 1000 * secTime)
        }
    }, time * 1000)
}

setTimeout(function () {
    loop()
}, 1000);