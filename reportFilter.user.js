// ==UserScript==
// @name         Report filter
// @namespace    http://tampermonkey.net/
// @version      2024-01-20
// @description  Filtrowanie i zaznaczanie raportow
// @author       Jakub Mikolajczyk
// @downloadURL  https://github.com/JakubMikolajczyk/Plemiona/raw/master/reportFilter.user.js
// @updateURL    https://github.com/JakubMikolajczyk/Plemiona/raw/master/reportFilter.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none

// @match        https://pl182.plemiona.pl/game.php?village=*&screen=report&mode=attack*
// @match        https://pl182.plemiona.pl/game.php?screen=report&mode=attack*
// @match        https://pl182.plemiona.pl/game.php?screen=report*&mode=attack
// ==/UserScript==

class reportRow {

    constructor(row) {
        let tds = row.getElementsByTagName("td")
        this.checkbox = tds[0].children[0]
        this.reportText = tds[1].innerText
        this.row = row
        this.dotType = this.getDotType()
        this.attackType = this.getAttackType()
    }

    getImgList() {
        return [...this.row
            .getElementsByTagName("td")[1].getElementsByTagName("img")]
    }

    getDotType() {
        return this.getImgList()
            .filter(x => x.src.includes("dots"))[0]
            .src
            .replace(".png", "")
            .split("/graphic/dots/")[1]
    }

    getAttackType() {
        return this.getImgList()
            .filter(x => x.src.includes("attack"))[0]
            .src
            .replace(".png", "")
            .split("graphic/command/")[1]
    }

    isContainSpy() {
        return this.getImgList()
            .filter(x => x.src.includes("spy")).length !== 0
    }

    isContainSnob() {
        return this.getImgList()
            .filter(x => x.src.includes("snob")).length !== 0
    }

    isConquer() {
        return this.reportText.includes("podbija")
    }

    isChecked() {
        return this.checkbox.checked
    }

    setChecked(checked) {
        this.checkbox.checked = checked
    }

    checked() {
        this.checkbox.checked = true
    }

    unChecked() {
        this.checkbox.checked = false
    }

    isHidden() {
        return this.row.hidden
    }

    setHidden(hidden) {
        this.row.hidden = hidden
    }

    hide() {
        this.row.hidden = true
    }

    unHide() {
        this.row.hidden = false
    }
}

class Input {
    constructor(input) {
        this.input = input
        this.input.type = "checkbox"
        this.input.onclick = null
        this.input.id = this.input.id + "_new" //turn off default save
    }

    setInputOnclick(fun) {
        this.input.onclick = fun
    }

    isChecked() {
        return this.input.checked
    }
}

class DotInput extends Input {
    constructor(type) {
        super(document.getElementById("filter_dots_" + type))
        this.type = type
    }

    getPred() {
        return (row) => row.dotType === this.type
    }

    getNegPred() {
        return (row) => !(row.dotType === this.type)
    }

}

class AttackTypeInput extends Input {
    constructor(type) {
        super(AttackTypeInput.getInput("attack_" + type))
        this.type = type
    }

    static getInput(attack_type) {
        return [...document.getElementsByName("filter_attack_type")]
            .slice(1)
            .filter(input => input.nextElementSibling.src.includes(attack_type))[0]
    }

    getPred() {
        return (row) => row.attackType === "attack_" + this.type
    }

    getNegPred() {
        return (row) => !(row.attackType === "attack_" + this.type)
    }
}

function makeReportRowsList() {
    return [...document.getElementById("report_list")
        .getElementsByTagName("tr")]
        .slice(1)
        .slice(0, -1)
        .map(row => new reportRow(row))
}

function rowsDoMultipleFilter(rows, arr){
    for (const elem of arr){
        if(!elem.isChecked())
            rows = rows.filter(elem.getNegPred())
    }
    return rows
}

function updateRows(rows, dots, attacks) {
    rows.forEach(row => row.unHide())

    const isDotChecked = dots.some(dot => dot.isChecked())
    const isAttackChecked = attacks.some(attack => attack.isChecked())

    if (isDotChecked)
        rows = rowsDoMultipleFilter(rows, dots)
    if (isAttackChecked)
        rows = rowsDoMultipleFilter(rows, attacks)

    if (isDotChecked || isAttackChecked)
        rows.forEach(row => row.hide())
}

function setCheckedAll(rows, input, hidden){
    rows.forEach(row => row.unChecked())
    rows.filter(row => row.isHidden() === hidden)
        .forEach(row => row.setChecked(input.checked))
}

function makeSelectAllInputs(rows){
    let topInput = document.getElementById("select_all_top")
    let bottomInput = document.getElementById("select_all")
    let hiddenInput = document.getElementById("select_all_hidden")

    console.log(hiddenInput)
    topInput.onclick = () => {
        bottomInput.checked = topInput.checked
        hiddenInput.checked = false
        setCheckedAll(rows, topInput, false)
    }
    bottomInput.onclick = () => {
        topInput.checked = bottomInput.checked
        hiddenInput.checked = false
        setCheckedAll(rows, bottomInput, false)
    }
}

function makeSelectHiddenInput(rows){
    let parent = document.getElementById("select_all").parentElement

    let newInput = document.createElement("input")
    newInput.id = "select_all_hidden"
    newInput.type = "checkbox"
    newInput.onclick = () => {
        document.getElementById("select_all_top").checked = false
        document.getElementById("select_all").checked = false
        setCheckedAll(rows, newInput, true)
    }
    let newLabel = document.createElement("label")
    newLabel.for = "select_all_hidden"
    newLabel.textContent = "zaznacz wszystkie ukryte"

    parent.colspan = "4"
    parent.append(newInput)
    parent.append(newLabel)
}

const dotTypes = ["blue", "green", "yellow", "red_yellow", "red_blue", "red"]
const attackTypes = ["small", "medium", "large"]

let rows = makeReportRowsList()
let dotInputs = dotTypes.map(dot => new DotInput(dot))
let attackInputs = attackTypes.map(attack => new AttackTypeInput(attack))

dotInputs.forEach(dot => dot.setInputOnclick(() => updateRows(rows, dotInputs, attackInputs)))
attackInputs.forEach(attack => attack.setInputOnclick(() => updateRows(rows, dotInputs, attackInputs)))

makeSelectHiddenInput(rows)
makeSelectAllInputs(rows)
