// ==UserScript==
// @name         Report filter
// @namespace    http://tampermonkey.net/
// @version      2024-01-20
// @description  Filtrowanie i zaznaczanie raportow
// @author       Jakub Mikolajczyk
// @match        https://pl182.plemiona.pl/game.php?village=*&screen=report
// @match        https://pl182.plemiona.pl/game.php?village=*&screen=report*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none
// ==/UserScript==

class reportRow{

    constructor(row) {
        let tds = row.getElementsByTagName("td")
        this.reportText = tds[1].innerText
        this.row = row
        this.checkbox = tds[0]
    }

    selectReport(){
        this.checkbox.checked = true
    }

    unSelectReport(){
        this.checkbox.checked = false
    }

    hideReportRow(){
        this.row.hidden = true
    }

    unHideReportRow(){
        this.row.hidden = false
    }
}

function makeReportRowsList(){
    return [... document.getElementById("report_list")
        .getElementsByTagName("tr")]
        .slice(1)
        .slice(0, -1)
        .map(row => new reportRow(row))
}

let reportsList = makeReportRowsList()

console.log(reportsList)