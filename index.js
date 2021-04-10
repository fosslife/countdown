let blessed = require("blessed");
const figlet = require('figlet');

// Create a screen object.
let screen = blessed.screen({
    smartCSR: true,
});

screen.title = "Timer";

let box = blessed.box({
    top: "center",
    left: "center",
    width: "100%",
    height: "100%",
    align: "center",
    valign: "middle",
    tags: true,
    border: {
        type: "line",
    },
    style: {
        fg: "white",
        border: {
            fg: "#f0f0f0",
        },
        hover: {
            bg: "green",
        },
    },
});
screen.append(box);
screen.key(["escape", "q", "C-c"], function (ch, key) {
    return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen.
screen.render();

let toCountFrom = process.argv[2];

function getExpiry(str) {
    const timeFactor = str.substring(str.length - 1);
    const time = str.substring(0, str.length - 1);

    const multipliers = {
        s: (t) => t,
        m: (t) => t * 60,
        h: (t) => t * 3600,
        // d: (t) => t * 86400,
        // w: (t) => t * 1.6534e-6,
        // M: (t) => t * 2.628e6,
    };
    return multipliers[timeFactor](time);
}

function convertToTimerString(t) {
    var time = t;
    let hours = Math.floor(time / 3600);
    time = time - hours * 3600;

    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    return [{ hours, minutes, seconds }, t];
}

const sleep = () => new Promise((res) => setTimeout(res, 1000));

async function startCountDown([timerObj, time]) {
    while (true) {
        // console.log(typeof timerObj.hours);
        let hoursText = timerObj.hours < 10 ? `0${timerObj.hours}` : timerObj.hours;
        let minutesText = timerObj.minutes < 10 ? `0${timerObj.minutes}` : timerObj.minutes;
        let secondsText = timerObj.seconds < 10 ? `0${timerObj.seconds}` : timerObj.seconds;
        let timerText = `${hoursText} : ${minutesText} : ${secondsText}`;
        let text = figlet.textSync(timerText, "ANSI Shadow");
        box.setContent(text);
        screen.render();
        await sleep();
        if (timerObj.seconds >= 0) {
            if (timerObj.seconds === 0) {
                timerObj.seconds = 60;
                if (timerObj.minutes >= 0) {
                    if (timerObj.minutes === 0) {
                        timerObj.minutes = 60;
                        if (timerObj.hours >= 0) {
                            timerObj.hours -= 1;
                        }
                    }
                    timerObj.minutes -= 1;
                }
            }
            timerObj.seconds -= 1;
        }

        if (
            timerObj.seconds === 0 &&
            timerObj.minutes === 0 &&
            timerObj.hours === 0
        ) {
            process.exit(0);
        }
    }
    return [timerObj, time];
}

startCountDown(convertToTimerString(getExpiry(toCountFrom)));
