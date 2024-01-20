// ==UserScript==
// @name         Etykieta
// @namespace    http://tampermonkey.net/
// @version      2023-12-21
// @description  //TODO
// @author       Jakub Mikolajczyk
// @downloadURL  https://github.com/JakubMikolajczyk/Plemiona/raw/master/labelVillage.user.js
// @updateURL    https://github.com/JakubMikolajczyk/Plemiona/raw/master/labelVillage.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none

// @match        https://pl182.plemiona.pl/game.php?village=*&screen=overview
// ==/UserScript==

const UnitTypes = {
    Szlachcic: 'snob',
    Taran: "ram"
}

class Command {

    constructor(row) {
        let tds = row.getElementsByTagName("td")
        let a = tds[0].getElementsByTagName("a")
        let commandContainer = a[0].children[0]
        this.commandId = commandContainer.children[0].getAttribute("data-command-id")
        this.commandType = commandContainer.children[0].getElementsByTagName("img")[0].src
            .replace(".png", "")
            .replace("https://dspl.innogamescdn.com/asset/72737c96/graphic/command/","")
        this.label = a[0].children[1]
        this.labelText = a[0].innerText
        this.editButton = a[1]
        this.arrive = tds[1].innerText
        this.duration = tds[2].innerText
        this.ignore = this.labelText.includes("(ignorowane)")
        this.labelText = this.labelText.replaceAll("\n", "").replace("(ignorowane)","").trim()
        this.attackType = this.commandType === "attack" ?  commandContainer.getElementsByTagName("img")[1].src
                .replace(".png", "")
                .replace("https://dspl.innogamescdn.com/asset/72737c96/graphic/unit/tiny/","")
            : null
    }

    makePrint(){
        return `[command]${this.commandType}[/command]`
            + (this.commandType === "attack" ? `[unit]${this.attackType}[/unit]` :"")
            + `${this.labelText}; ${this.arrive} [size=1]${this.commandId}[\size]`
    }

    setLabel(val){
        this.labelText = val
        this.label.innerHTML = val
        this.editButton.click()
    }

    setAtFrontLabel(val){
        this.setLabel(val + this.labelText)
    }

    setAtEndLabel(val){
        this.setLabel(this.labelText + val)
    }

}

class Notes{

    constructor() {
        this.notes = document.getElementById("show_notes")
        this.notesEdit = document.getElementById("edit_notes_link")
    }
}


function getIncomingAttacks(){
    return [... document.getElementById("commands_incomings").getElementsByTagName("tr")]
        .slice(1)
        .slice(0, -3)
}


getIncomingAttacks().map(x => new Command(x)).filter(x => x.commandType === "attack").forEach(x => x.setAtFrontLabel("OK "))