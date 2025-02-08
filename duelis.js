function isPlay() {
    return gam_state === "play" || gam_state === "fin";
}

// Role groups for AK scripts
const akPilsRoles = ['Pilsonis', 'Komisārs', 'Seržants', 'Ārsts', 'Medicīnas Darbinieks', 'Zaglis', 'Maita', 'Liecinieks', 'Nāvinieks'];
const akMafiRoles = ['Mafiozo', 'Divkosis', 'Mafijas Boss'];
const akVisiRoles = null; // No specific role check for "AK VISI"

// Create toggle button to show/hide the control panel
let toggleButton = document.createElement("button");
toggleButton.textContent = "Skripti";
Object.assign(toggleButton.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    padding: "10px",
    background: "#444",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: "10000"
});
document.body.appendChild(toggleButton);

// Create the control panel container
let panel = document.createElement("div");
Object.assign(panel.style, {
    position: "fixed",
    top: "50px",
    right: "10px",
    background: "#222",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
    zIndex: "9999",
    color: "white",
    fontSize: "14px",
    display: "none",
    flexDirection: "column"
});
document.body.appendChild(panel);

// Toggle panel visibility
toggleButton.onclick = () => {
    panel.style.display = panel.style.display === "none" ? "flex" : "none";
};

// Function to create a toggleable script button with interval input
function createToggleButtonWithInterval(name, actionId, useExtras, roles, defaultInterval = 250) {
    // Create container for button and input
    let container = document.createElement("div");
    Object.assign(container.style, {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        marginBottom: "5px"
    });

    // Create the button
    let button = document.createElement("button");
    button.textContent = name;
    Object.assign(button.style, {
        padding: "8px",
        fontSize: "14px",
        cursor: "pointer",
        backgroundColor: "#444",
        color: "white",
        border: "none",
        borderRadius: "5px",
    });

    // Create the interval input
    let intervalInput = document.createElement("input");
    intervalInput.type = "number";
    intervalInput.value = defaultInterval;
    intervalInput.min = 100;
    intervalInput.max = 5000;
    intervalInput.step = 50;
    Object.assign(intervalInput.style, {
        width: "60px",
        padding: "5px",
        fontSize: "14px",
        borderRadius: "5px",
        border: "1px solid #555",
        backgroundColor: "#333",
        color: "white"
    });

    // Add elements to the container
    container.appendChild(button);
    container.appendChild(intervalInput);
    panel.appendChild(container);

    // Script state
    let scriptState = { active: false, interval: null };

    // Button click handler
    button.onclick = () => {
        if (scriptState.active) {
            clearInterval(scriptState.interval);
            scriptState.active = false;
            button.style.backgroundColor = "#444";
            console.log(`%c[${name}] Script Stopped!`, "color: red; font-weight: bold;");
        } else {
            const interval = parseInt(intervalInput.value, 10);
            scriptState.interval = setInterval(() => {
                if (!isPlay() || $('#pp_fin').length || pla_data['dead'] || $("#gxt_" + actionId).hasClass("disabled")) {
                    return;
                }
                if (roles) {
                    let myRole = document.getElementsByClassName("ico my")[0]?.title;
                    if (!roles.includes(myRole)) return;
                }
                let players = document.querySelectorAll("li[id^='upl_']");
                for (let player of players) {
                    let player_id = player.id.match(/\d+/)[0];
                    _GM_action('', 'ext_use', [actionId, player_id], event);
                    break;
                }
            }, interval);
            scriptState.active = true;
            button.style.backgroundColor = "green";
            console.log(`%c[${name}] Script Started!`, "color: green; font-weight: bold;");
        }
    };
}

// Create AK buttons with interval input
createToggleButtonWithInterval("AK PILS", 159, false, akPilsRoles, 250);
createToggleButtonWithInterval("AK MAFI", 159, false, akMafiRoles, 250);
createToggleButtonWithInterval("AK VISI", 159, false, akVisiRoles, 250);

// Function to create toggleable script button (for others)
function createToggleButton(name, scriptFunction) {
    let button = document.createElement("button");
    button.textContent = name;
    Object.assign(button.style, {
        padding: "8px",
        fontSize: "14px",
        cursor: "pointer",
        backgroundColor: "#444",
        color: "white",
        border: "none",
        borderRadius: "5px",
        marginBottom: "5px",
    });
    panel.appendChild(button);
    let scriptState = { active: false, interval: null };
    button.onclick = () => {
        if (scriptState.active) {
            clearInterval(scriptState.interval);
            scriptState.active = false;
            button.style.backgroundColor = "#444";
            console.log(`%c[${name}] Script Stopped!`, "color: red; font-weight: bold;");
        } else {
            scriptState.interval = setInterval(scriptFunction, 250);
            scriptState.active = true;
            button.style.backgroundColor = "green";
            console.log(`%c[${name}] Script Started!`, "color: green; font-weight: bold;");
        }
    };
}

// Create non-AK buttons
createToggleButton("TARO", function () {
    if (!isPlay()) return;
    let extra = "156";
    $("#upl_list").children().each((index, elem) => {
        let player_type = $(elem).find(".hint").text();
        if (player_type === "miris" || player_type === "aiz restēm") return;
        const id = $(elem).attr("id").substr(4);
        if (id == my_id) {
            let target_i = index + 1;
            let failed = 0;
            while (true) {
                if (target_i > $("#upl_list").children().length - 1) {
                    target_i = 0;
                    if (failed++ > 1) break;
                }
                let target_elem = $("#upl_list").children().eq(target_i);
                let isOpen = $(target_elem).find(".ico").attr("title");
                const target_id = $(target_elem).attr("id").substr(4);
                if (!isOpen) {
                    _GM_action("", "ext_use", [+extra, target_id]);
                    break;
                }
                target_i++;
            }
        }
    });
});

createToggleButton("GRĒKI", function () {
    if (gam_state == 'play' && (!($('#pp_fin').length || pla_data['dead']))) {
        if ((!$("#gxt_155").is(".disabled"))) {
            let player = document.querySelector('.playersList').querySelectorAll('li')[0];
            let player_id = player.id.split('_')[1];
            _GM_action('', 'ext_use', [155, player_id], event);
        }
    }
});

createToggleButton("MIEGAZĀLES", () => createAutoButton("MIEGAZĀLES", 170, true));
createToggleButton("DUBULTBALSS", () => createAutoButton("DUBULTBALSS", 103, true));
createToggleButton("VABOLES", function () {
    if (gam_state == 'play' && (!($('#pp_fin').length || pla_data['dead']))) {
        if ((!$("#gxt_101").is(".disabled"))) {
            let player = document.querySelector('.playersList').querySelectorAll('li')[0];
            let player_id = player.id.split('_')[1];
            _GM_action('', 'ext_use', [101, player_id], event);
        }
    }
});

// REVO (Executes when alive)
createToggleButton("REVO", function () {
    if (gam_state == 'play' && (!($('#pp_fin').length || pla_data['dead']))) {
        if ((!$("#gxt_105").is(".disabled"))) {
            let player = document.querySelector('.playersList').querySelectorAll('li')[0];
            let player_id = player.id.split('_')[1];
            _GM_action('', 'ext_use', [105, player_id], event);
        }
    }
});

// KILLERI
createToggleButton("KILLERI", function () {
    if (gam_state == 'play' && (pla_data['dead'])) {  // Only runs when you are dead
        if ((!$("#gxt_115").is(".disabled"))) {
            let player = document.querySelector('.playersList').querySelectorAll('li')[0];
            let player_id = player.id.split('_')[1];
            _GM_action('', 'ext_use', [115, player_id], event);
        }
    }
});

// BOSI functionality
let bosiButton = document.createElement("button");
bosiButton.textContent = "BOSI";
Object.assign(bosiButton.style, {
    padding: "8px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#444",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginBottom: "5px",
});
panel.appendChild(bosiButton);

let bosiState = { active: false, interval: null };

bosiButton.onclick = () => {
    if (bosiState.active) {
        clearInterval(bosiState.interval);
        bosiState.active = false;
        bosiButton.style.backgroundColor = "#444";
        console.log("%c[BOSI] Script Stopped!", "color: red; font-weight: bold;");
    } else {
        bosiState.interval = setInterval(() => {
            let likme = 10000; // MAX LIKME
            var boss = parseInt($('.bossBet > span').text());
            if (_CHT_bss[0] != my_id && (ifc_mode == 'chat' || ifc_mode == 'room') && likme > boss) {
                _DLG('boss', 2);
            }
        }, 110);
        bosiState.active = true;
        bosiButton.style.backgroundColor = "green";
        console.log("%c[BOSI] Script Started!", "color: green; font-weight: bold;");
    }
};
