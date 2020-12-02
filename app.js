const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employee_db"
});

// connection.connect(function(err){
//     if (err) throw err;
//     console.table([
//         {"Hello Friend!": "WELCOME TO THE EMPLOYEE TRACKER!"}
//     ]);
//     init();
// });

const initQuestion = [{
    name: "intro",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add Employee", "Remove Employee", "View Employees", "View Employees by Department", "View Employees by Manager", "Update Employee Role", "Update Employee Manager", "Exit"]
}]


const addEmployeeQuestions = [{
    name: "employeeFirstName",
    type: "input",
    message: "Enter the new employee's first name:"
}, {
    name: "employeeLastName",
    type: "input",
    message: "Enter the new employee's last name:"
}, {
    name: "employeeRole",
    type: "list",
    message: "Choose the new employee's role:",
    choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"]
}, {
    name: "employeeMgmtId",
    type: "number",
    message: "Enter the new employee's manager's ID number:"
}];

const removeEmployeeQuestions = [{
    name: "removeFirstName",
    type: "input",
    message: "Please enter the first name of the employee you would like to remove."
}, {
    name: "removeLastName",
    type: "input",
    message: "Please enter the last name of the employee you would like to remove."
}];

function init() {
    inquirer.prompt(initQuestion)
        .then(async function (answer) {
            switch (answer.intro) {
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "View Employees":
                    viewEmployees();
                    break;
                case "View Employees by Department":

                    break;
                case "View Employees by Manager":

                    break;
                case "Update Employee Role":

                    break;
                case "Update Employee Manager":

                    break;
                case "Exit":
                    return process.kill(process.pid);
                    break;
            }
        });
}

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


function addEmployee() {
    let empRole;
    inquirer.prompt(addEmployeeQuestions)
        .then(function (answer) {
            let roleChoice = answer.employeeRole;
            switch (roleChoice) {
                case "Sales Lead":
                case "Salesperson":
                case "Account Manager":
                    empRole = 4;
                    break;
                case "Lead Engineer":
                case "Software Engineer":
                    empRole = 1;
                    break;
                case "Accountant":
                    empRole = 2;
                    break;
                case "Legal Team Lead":
                    empRole = 3;
                    break;
            }
            connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: answer.employeeFirstName,
                    last_name: answer.employeeLastName,
                    role_id: empRole,
                    manager_id: answer.employeeMgmtId
                },
                function (err) {
                    if (err) throw err;
                    console.log("Successfully added employee.");
                    restartApp();
                }
            )
        });
}

function viewEmployees() {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        console.table(res);
        restartApp();
    });
}

function removeEmployee() {
    inquirer.prompt(removeEmployeeQuestions)
        .then(function (answer) {
            connection.query(
                "SELECT * FROM employee WHERE first_name = ? AND last_name = ?",
                [answer.removeFirstName, answer.removeLastName],
                function (err, res) {
                    console.log(res);
                    let empId = res[0].id;
                    console.log(empId);
                    if (err) throw err;
                    if (res) {
                        inquirer.prompt({
                            name: "confirmdelete",
                            type: "list",
                            message: "Would you like to delete " + answer.removeFirstName + " " + answer.removeLastName + "?",
                            choices: ["Yes", "No"]
                        }).then(function (answer) {
                            if (answer.confirmdelete === "No") {
                                restartApp();
                            } else {
                                connection.query(
                                    "DELETE FROM employee WHERE id = ?",
                                    empId,
                                    function (err, result) {
                                        console.log(result);
                                        if (err) throw err;
                                        if (res.affectedRows === 0) {
                                            console.log("! No employee found with the provided information");
                                            restartApp();
                                        } else {
                                            console.log("Successfully deleted employee");
                                            restartApp();
                                        }
                                    }
                                );
                            }
                        });
                    }
                });
        });
}

init();