const inquirer = require("inquirer");
const appjs = require("./app");

function restartApp() {
    inquirer.prompt({
        name: "whatnext",
        type: "list",
        message: "What would you like to do next?",
        choices: ["Start Over", "Exit"]
    }).then(async function (answer) {
        switch (answer.whatnext) {
            case "Start Over":
                init();
                break;
            case "Exit":
                return process.kill(process.pid);
        }
    });
}

module.exports = restartApp();