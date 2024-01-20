// ==UserScript==
// @name         SelectByCordGroup
// @namespace    http://tampermonkey.net/
// @version      2024-01-12
// @description  Zaznaczanie wioski po wprowadzonych kordach (odzielanie spacja, enter)
// @author       Jakub Mikolajczyk
// @downloadURL  https://github.com/JakubMikolajczyk/Plemiona/raw/master/selectByCordGroup.user.js
// @updateURL    https://github.com/JakubMikolajczyk/Plemiona/raw/master/selectByCordGroup.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none

// @match        https://pl182.plemiona.pl/game.php?village=*&screen=overview_villages&mode=groups
// @match        https://pl182.plemiona.pl/game.php?village=*&screen=overview_villages&&mode=groups&type=static
// @match        https://pl182.plemiona.pl/game.php?village=*&screen=overview_villages&type=static&mode=groups&group=*
// ==/UserScript==

class Row {

    constructor(tr) {
        const cordPattern = /\d\d\d\|\d\d\d/g
        const td = tr.getElementsByTagName("td")[0]
        this.checkbox = td.getElementsByTagName("input")[0]
        const name = td.getElementsByClassName("quickedit-label")[0].innerHTML
        const match = name.match(cordPattern)
        this.cord = match[match.length - 1]
    }

    selectBox() {
        this.checkbox.checked = true
    }

    unselectBox() {
        this.checkbox.checked = false
    }
}

function getRows() {

    return [...document.getElementById("group_assign_table")
        .querySelectorAll('.row_a, .row_b')]
        .map(x => new Row(x))
}

function getCords(){
    let cords = prompt("Wprowadz kordy")
    if (cords == null)
        return

    cordsDic = new Set(cords.split(/\s+/))
    console.log(cordsDic)
    getRows().forEach(row => {
        console.log(row)
        row.unselectBox()
        if (cordsDic.has(row.cord))
            row.selectBox()
    })
}

function createImportButton() {

    let importButton = document.createElement("input")
    importButton.className = "btn"
    importButton.value = "Wybierz po kordach"
    importButton.addEventListener("click", () => {
        getCords()
    })
    let form = document.getElementById("group_assign_table").parentNode
    form.append(importButton)

}

createImportButton()
