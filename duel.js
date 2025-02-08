// Function to check if the game is in play mode
function isPlay() {
    return gam_state === "play" || gam_state === "fin";
}

// Role groups for AK scripts
const akPilsRoles = ['Pilsonis', 'Komisārs', 'Seržants', 'Ārsts', 'Medicīnas Darbinieks', 'Zaglis', 'Maita', 'Liecinieks', 'Nāvinieks'];
const akMafiRoles = ['Mafiozo', 'Divkosis', 'Mafijas Boss'];

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

// Function to create a button
function createAutoButton(name, actionCode, isTargeted = false, roleCheck = null, allowDelay = false) {
    let button = document.createElement('button');
    button.textContent = name;
    Object.assign(button.style, {
        padding: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#444',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        marginBottom: '5px',
    });

    panel.appendChild(button);

    let delayInput;
    if (allowDelay) {
        delayInput = document.createElement("input");
        delayInput.type = "number";
        delayInput.value = 300;
        delayInput.style.marginLeft = "5px";
        delayInput.style.width = "50px";
        panel.appendChild(delayInput);
    }

    let scriptState = { active: false, interval: null };

    button.onclick = () => {
        if (scriptState.active) {
            clearInterval(scriptState.interval);
            scriptState.active = false;
            button.style.backgroundColor = '#444';
            console.log(`%c[${name}] Script Stopped!`, 'color: red; font-weight: bold;');
        } else {
            let intervalTime = allowDelay ? parseInt(delayInput.value) || 300 : 300;
            scriptState.interval = setInterval(() => {
                if (!isPlay() || $('#pp_fin').length || pla_data['dead'] || $("#gxt_" + actionCode).hasClass("disabled")) {
                    return;
                }
                if (roleCheck) {
                    let myRole = document.getElementsByClassName("ico my")[0]?.title;
                    if (!roleCheck.includes(myRole)) return;
                }
                let players = document.querySelectorAll("li[id^='upl_']");
                for (let player of players) {
                    let player_id = player.id.match(/\d+/)[0];
                    _GM_action('', 'ext_use', [actionCode, player_id], event);
                    break;
                }
            }, intervalTime);
            scriptState.active = true;
            button.style.backgroundColor = 'green';
            console.log(`%c[${name}] Script Started!`, 'color: green; font-weight: bold;');
        }
    };
}

// Create buttons
createAutoButton("AK PILS", 159, false, akPilsRoles, true);
createAutoButton("AK MAFI", 159, false, akMafiRoles, true);
createAutoButton("AK VISI", 159, false, null, true);
createAutoButton("TARO", 156, true);
createAutoButton("GRĒKI", 155, true);
createAutoButton("MIEGAZĀLES", 170, true);
createAutoButton("REVO", 105, true);
createAutoButton("KILLERI", 115, true);
createAutoButton("VABOLES", 101, true);
createAutoButton("DUBULTBALSS", 103, true);

// BOSI uses a different function
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
