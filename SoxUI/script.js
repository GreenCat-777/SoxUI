/*
  SoxUI - ES5 only (Mesquite/old WebKit).
  Runs Sox extension scripts via Utild (com.kindlemodding.utild).
  KindleForge-style: appmgr.ongo, chromebar, (window.kindle || top.kindle).
*/

var COMMANDS = {
    playall: "sh /mnt/us/extensions/sox/playall.sh",
    bookmark: "sh /mnt/us/extensions/sox/bookmark.sh",
    stop: "sh /mnt/us/extensions/sox/killsox.sh"
};

function setStatus(text) {
    var el = document.getElementById("status");
    if (el) el.innerHTML = text;
}

function getKindle() {
    try {
        if (typeof window !== "undefined" && window.kindle) return window.kindle;
        if (typeof top !== "undefined" && top.kindle) return top.kindle;
    } catch (e) {
        return window.kindle || null;
    }
    return null;
}

function runCmd(cmd) {
    var kindle = getKindle();
    if (!kindle || !kindle.messaging) {
        setStatus("Kindle API not available.");
        return;
    }
    if (typeof kindle.messaging.sendStringMessage !== "function") {
        setStatus("sendStringMessage not available.");
        return;
    }
    try {
        (window.kindle || top.kindle).messaging.sendStringMessage("com.kindlemodding.utild", "runCMD", cmd);
        setStatus("Command sent.");
    } catch (err) {
        setStatus("Error: " + (err.message || String(err)));
    }
}

/* Chromebar (KindleForge-style) - top bar with title and close button */
function updateChrome() {
    var kindle = getKindle();
    if (!kindle || !kindle.messaging) return;
    var chromebar = {
        appId: "com.illusion.soxui",
        topNavBar: {
            template: "title",
            title: "SoxUI",
            buttons: [
                { id: "KPP_MORE", state: "enabled", handling: "system" },
                { id: "KPP_CLOSE", state: "enabled", handling: "system" }
            ]
        }
    };
    try {
        (window.kindle || top.kindle).messaging.sendMessage("com.lab126.chromebar", "configureChrome", chromebar);
    } catch (e) {}
}

if (typeof window !== "undefined" && window.kindle) {
    window.kindle.appmgr = window.kindle.appmgr || {};
    window.kindle.appmgr.ongo = function() {
        updateChrome();
    };
}

document.addEventListener("DOMContentLoaded", function() {
    var btnPlayAll = document.getElementById("btn-playall");
    var btnBookmark = document.getElementById("btn-bookmark");
    var btnStop = document.getElementById("btn-stop");

    if (btnPlayAll) {
        btnPlayAll.addEventListener("click", function() {
            setStatus("Running Play All…");
            runCmd(COMMANDS.playall);
        });
    }
    if (btnBookmark) {
        btnBookmark.addEventListener("click", function() {
            setStatus("Running Bookmark…");
            runCmd(COMMANDS.bookmark);
        });
    }
    if (btnStop) {
        btnStop.addEventListener("click", function() {
            setStatus("Running Stop Sox…");
            runCmd(COMMANDS.stop);
        });
    }
});
