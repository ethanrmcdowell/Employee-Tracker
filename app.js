const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employee_db"
});

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
    type: "list",
    message: "Select the new employee's manager:",
    choices: listmanagers()
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

const chooseDepartment = [{
    name: "chooseDepartment",
    type: "list",
    message: "Select a department to view all employees within.",
    choices: ["Engineering", "Finance", "Legal", "Sales"]
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
                    viewByDept();
                    break;
                case "View Employees by Manager":
                    viewByManager();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Update Employee Manager":

                    break;
                case "Exit":
                    return process.kill(process.pid);
            }
        });
}

function listAllEmployees() {
    let employeeList = [];
    connection.query(
        "SELECT * FROM employee ORDER BY last_name",
        function (err) {
            if (err) throw err;
        }
    )
}

function restartApp() {
    setTimeout(function () {
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
    }, 1000);
}


function addEmployee() {
    let empRole;
    inquirer.prompt(addEmployeeQuestions)
        .then(function (answer) {
            let managerchoice = answer.employeeMgmtId;
            let mgmtvalue = managerchoice.split(" ");
            let managerFirstName = mgmtvalue.shift();
            let managerLastName = mgmtvalue.join(' ');
            let managerid;
            connection.query(
                "SELECT id FROM employee WHERE first_name = ? AND last_name = ?",
                [managerFirstName, managerLastName],
                function (err, res) {
                    if (err) throw err;
                    managerid = res[0].id;
                });
            let roleChoice = answer.employeeRole;
            switch (roleChoice) {
                case "Sales Lead": empRole = 1;
                    break;
                case "Salesperson": empRole = 2;
                    break;
                case "Lead Engineer": empRole = 3;
                    break;
                case "Software Engineer": empRole = 4;
                    break;
                case "Account Manager": empRole = 5;
                    break;
                case "Accountant": empRole = 6;
                    break;
                case "Legal Team Lead": empRole = 7;
                    break;
            }
            connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: answer.employeeFirstName,
                    last_name: answer.employeeLastName,
                    role_id: empRole,
                    manager_id: managerid
                },
                function (err) {
                    if (err) throw err;
                    console.log("Successfully added employee.");
                    restartApp();
                }
            );
        });
}

function viewEmployees() {
    let query = "SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title as 'Job Title' FROM employee JOIN role ON employee.role_id = role.id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        restartApp();
    });
}

function viewByDept() {
    inquirer.prompt(chooseDepartment)
        .then(function (answer) {
            let department = answer.chooseDepartment;
            let deptId;
            switch (department) {
                case "Engineering":
                    deptId = 1;
                    break;
                case "Finance":
                    deptId = 2;
                    break;
                case "Legal":
                    deptId = 3;
                    break;
                case "Sales":
                    deptId = 4;
                    break;
            }
            connection.query(
                "SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id WHERE department_id = ?",
                deptId,
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    restartApp();
                }
            );
        });
}

function updateRole() {
    let employees = [];
    connection.query(
        "SELECT * FROM employee ORDER BY last_name",
        function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                employees.push(res[i].first_name + " " + res[i].last_name);
            }
            inquirer.prompt({
                name: "chooseEmployee",
                type: "rawlist",
                message: "Select the employee you would like to update.",
                choices: employees
            }).then(function (answer) {
                let employeepick = answer.chooseEmployee;
                let values = employeepick.split(" ");
                let employeeFirstName = values.shift();
                let employeeLastName = values.join(' ');
                inquirer.prompt([{
                    name: "changerole",
                    type: "list",
                    message: "Select the role you would like " + employeepick + " to be assigned to.",
                    choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"]
                }]).then(function (answer) {
                    let rolechoice;
                    switch (answer.changerole) {
                        case "Sales Lead":
                        case "Salesperson":
                        case "Account Manager":
                            rolechoice = 4;
                            break;
                        case "Lead Engineer":
                        case "Software Engineer":
                            rolechoice = 1;
                            break;
                        case "Accountant":
                            rolechoice = 2;
                            break;
                        case "Legal Team Lead":
                            rolechoice = 3;
                            break;
                    }
                    connection.query(
                        "UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?",
                        [rolechoice, employeeFirstName, employeeLastName],
                        function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            restartApp();
                        });
                });
            });
        });
}

function viewByManager() {
    let managers = [];
    connection.query(
        "SELECT * FROM employee WHERE manager_id IS NULL",
        function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                managers.push(res[i].first_name + " " + res[i].last_name);
            }
            inquirer.prompt({
                name: "chooseManager",
                type: "list",
                message: "Select a manager.",
                choices: managers
            }).then(function (answer) {
                let managerpick = answer.chooseManager;
                managerpick = managerpick.substr(0, managerpick.indexOf(' '));
                connection.query(
                    "SELECT id FROM employee WHERE first_name = ?",
                    managerpick,
                    function (err, res) {
                        if (err) throw err;
                        let managerid = res[0].id;
                        connection.query(
                            "SELECT employee.id, employee.first_name, employee.last_name, department.name FROM employee INNER JOIN department ON employee.role_id = department.id WHERE manager_id = ?",
                            managerid,
                            function (err, res) {
                                if (err) throw err;
                                console.table(res);
                                restartApp();
                            }
                        )
                    }
                );
            });
        });
}

function removeEmployee() {
    inquirer.prompt(removeEmployeeQuestions)
        .then(function (answer) {
            connection.query(
                "SELECT * FROM employee WHERE first_name = ? AND last_name = ?",
                [answer.removeFirstName, answer.removeLastName],
                function (err, res) {
                    console.table(res);
                    let empId = res[0].id;
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
                                    function (err, res) {
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

function listmanagers() {
    let managers = [];
    connection.query(
        "SELECT * FROM employee WHERE manager_id IS NULL",
        function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                managers.push(res[i].first_name + " " + res[i].last_name);
            }
        });
    return managers;
}

init();