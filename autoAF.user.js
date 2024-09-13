// ==UserScript==
// @name         AF
// @namespace    http://tampermonkey.net/
// @version      2024-01-20
// @description  Autosend, Autohide
// @author       Jakub Mikolajczyk
// @downloadURL  https://github.com/JakubMikolajczyk/Plemiona/raw/master/AF.user.js
// @updateURL    https://github.com/JakubMikolajczyk/Plemiona/raw/master/AF.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none

// @match        https://*.plemiona.pl/game.php?village=*&screen=am_farm

// @require      file:///Users/jakubmikolajczyk/WebstormProjects/plemiona/AF.user.js
// ==/UserScript==

class AFRow{

    constructor(row) {
        this.row = row
    }

    sendA(){
        let td = this.row.querySelectorAll("td")[8]
        td.querySelector("a").click()
    }

    sendB(){
        let td = this.row.querySelectorAll("td")[9]
        td.querySelector("a").click()
    }
}

function getAFRows()
{
    let rows = []
    let trs = document.querySelector("#plunder_list").querySelectorAll("tr")
    for (let i = 2; i < trs.length; i++) {
        rows.push(new AFRow(trs[i]))
    }
    return rows
}

function getLkNum()
{
    return Number(document.querySelector("#light").innerHTML)
}
setTimeout(function(){
    let lkNum = getLkNum()
    console.log("Sending " + lkNum)
    afRows = getAFRows()
    let i = 0
    let interval = setInterval(loop, Math.random() * 400 + 200)
    function loop() {
        afRows[i].sendA()
        i++
        if (i >= lkNum || i >= afRows.length)
            clearInterval(interval)
    }
    let time = Math.random() * 60 * 10 + 60 * 5
    console.log("WAITING " + time)
    setTimeout(x => location.reload(), 1000 * time)
}, 1000);