// ==UserScript==
// @name         ChangeVillageMap
// @namespace    http://tampermonkey.net/
// @version      2024-01-12
// @description  Ikona rekrutacji na mapie zmienia wioske, nie wychodzac z poziomu mapy
// @author       Jakub Mikolajczyk
// @downloadURL  https://github.com/JakubMikolajczyk/Plemiona/raw/master/changeVillageMap.user.js
// @updateURL    https://github.com/JakubMikolajczyk/Plemiona/raw/master/changeVillageMap.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none

// @match        https://pl182.plemiona.pl/game.php?village=*&screen=map
// ==/UserScript==

let fav = document.getElementById("mp_recruit")
fav.onclick = function () {
    let villageId = document.getElementById("mp_info").href.split("&screen=info_village&id=")[1]
    fav.href = "game.php?village=" + villageId + "&screen=map"
}