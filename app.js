// GLOBAL VARIABLES
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// SQL CONNECTION
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employee_db"
});

// LISTS OF INQUIRER QUESTIONS
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
    choices: listroles()
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
    choices: listdepartments()
}];

const initQuestion = [{
    name: "intro",
    type: "list",
    message: "Make a selection:",
    choices: ["View", "Add", "Remove", "Update", "Budget", "Exit"]
}];

const updateQuestion = [{
    name: "update",
    type: "list",
    message: "What would you like to update?",
    choices: ["Update Employee Role", "Update Employee Manager", "Go Back"]
}];

const removeQuestion = [{
    name: "remove",
    type: "list",
    message: "What would you like to remove?",
    choices: ["Remove Employee", "Remove Role", "Remove Department", "Go Back"]
}];

const addQuestion = [{
    name: "add",
    type: "list",
    message: "What would you like to add?",
    choices: ["Add Employee", "Add Role", "Add Department", "Go Back"]
}];

const viewQuestion = [{
    name: "view",
    type: "list",
    message: "What would you like to view?",
    choices: ["View All Employees", "View Roles", "View Departments", "View Employees by Department", "View Employees by Manager", "Go Back"]
}];

const budgetQuestion = [{
    name: "budget",
    type: "list",
    message: "What would you like to do?",
    choices: ["View Total Salary Budget", "View Salary Budget by Department", "View All Employee Salaries"]
}];

// INIT FUNCTION WHICH DISPLAYS INITIAL QUESTIONS AND HAS SWITCH STATEMENTS FOR EACH RESPONSE
function init() {
    inquirer.prompt(initQuestion)
        .then(async function (answer) {
            switch (answer.intro) {
                case "View":
                    introView();
                    break;
                case "Add":
                    introAdd();
                    break;
                case "Remove":
                    introRemove();
                    break;
                case "Update":
                    introUpdate();
                    break;
                case "Budget":
                    introBudget();
                    break;
                case "Exit":
                    return process.kill(process.pid);
            }
        });
}

// FUNCTION WHICH RUNS AFTER FINISHING VARIOUS TASKS, ASKS IF YOU'D LIKE TO START APP OVER (GOES TO INIT MENU) OR EXIT APP - ONE SECOND DELAY BEFORE PROMPTING USER
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

// DISPLAYS QUESTIONS UPON SELECTING 'ADD' ON INIT MENU, SWITCH STATEMENTS FOR EACH RESPONSE
function introAdd() {
    inquirer.prompt(addQuestion)
        .then(async function (answer) {
            switch (answer.add) {
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Go Back":
                    init();
                    break;
            }
        });
}

// DISPLAYS QUESTIONS UPON SELECTING 'VIEW' ON INIT MENU, SWITCH STATEMENTS FOR EACH RESPONSE
function introView() {
    inquirer.prompt(viewQuestion)
        .then(async function (answer) {
            switch (answer.view) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "View Departments":
                    viewDepartments();
                    break;
                case "View Employees by Department":
                    viewByDept();
                    break;
                case "View Employees by Manager":
                    viewByManager();
                    break;
                case "Go Back":
                    init();
                    break;
            }
        });
}

// DISPLAYS QUESTIONS UPON SELECTING 'REMOVE' ON INIT MENU, SWITCH STATEMENTS FOR EACH RESPONSE
function introRemove() {
    inquirer.prompt(removeQuestion)
        .then(async function (answer) {
            switch (answer.remove) {
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Remove Role":
                    removeRole();
                    break;
                case "Remove Department":
                    removeDepartment();
                    break;
                case "Go Back":
                    init();
                    break;
            }
        });
}

// DISPLAYS QUESTIONS UPON SELECTING 'UPDATE' ON INIT MENU, SWITCH STATEMENTS FOR EACH RESPONSE
function introUpdate() {
    inquirer.prompt(updateQuestion)
        .then(async function (answer) {
            switch (answer.update) {
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Update Employee Manager":
                    updateManager();
                    break;
                case "Go Back":
                    init();
                    break;
            }
        })
}

// DISPLAYS QUESTIONS UPON SELECTING 'BUDGET' ON INIT MENU, SWITCH STATEMENTS FOR EACH RESPONSE
function introBudget() {
    inquirer.prompt(budgetQuestion)
        .then(async function (answer) {
            switch (answer.budget) {
                case "View Total Salary Budget":
                    totalSalary();
                    break;
                case "View Salary Budget by Department":
                    deptSalary();
                    break;
                case "View All Employee Salaries":
                    listSalary();
                    break;
            }
        });
}

// FUNCTION TO DISPLAY THE TOTAL SALARY/LABOR COSTS
function totalSalary() {
    let totalSalary = 0;
    connection.query(
        "SELECT role.salary FROM employee JOIN role ON employee.role_id = role.id",
        function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                totalSalary = totalSalary + res[i].salary;
            }
            console.log("\n $ TOTAL LABOR COSTS: $" + totalSalary.toFixed(2) + "\n");
            restartApp();
        });
}

// FUNCTION WHICH ALLOWS YOU TO SELECT A DEPARTMENT AND WILL DISPLAY TOTAL LABOR COSTS FOR THAT DEPARTMENT
function deptSalary() {
    let departments = [];
    let deptSalary = 0;
    connection.query(
        "SELECT name FROM department",
        function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                departments.push(res[i].name);
            }
            inquirer.prompt({
                name: "deptChoice",
                type: "list",
                message: "Select a department:",
                choices: departments
            }).then(async function (answer) {
                connection.query(
                    "SELECT role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = ?",
                    answer.deptChoice,
                    function (err, res) {
                        let deptChoice = answer.deptChoice.toUpperCase();
                        if (err) throw err;
                        for (i = 0; i < res.length; i++) {
                            deptSalary = deptSalary + res[i].salary;
                        }
                        console.log("\n $ TOTAL LABOR COST FOR " + deptChoice + " : $" + deptSalary.toFixed(2) + "\n");
                        restartApp();
                    });
            });
        });
}

// FUNCTION WHICH LISTS ALL EMPLOYEES ORDERED ALPHABETICALLY BY LAST NAME AND SHOWS EACH INDIVIDUAL'S SALARY
function listSalary() {
    connection.query(
        "SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.salary AS 'Salary' FROM employee JOIN role ON employee.role_id = role.id ORDER BY last_name",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            restartApp();
        });
}

// FUNCTION DISPLAYS ALL DEPARTMENTS AVAILABLE
function viewDepartments() {
    connection.query(
        "SELECT name AS 'Department Name' FROM department",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            restartApp();
        }
    )
}

// FUNCTION TO REMOVE THE SELECTED DEPARTMENT, WILL ASK FOR CONFIRMATION BEFORE DELETING, WILL SET ANYTHING RELIANT ON THIS DEPT AS 'NULL' WHERE REFERENCING DEPARTMENT AS PER SCHEMA
function removeDepartment() {
    connection.query(
        "SELECT name FROM department",
        function (err, res) {
            if (err) throw err;
            let departmenttitles = [];
            for (let i = 0; i < res.length; i++) {
                departmenttitles.push(res[i].name);
            }
            inquirer.prompt({
                name: "removedepttitle",
                type: "list",
                message: "Select the department to be removed.",
                choices: departmenttitles
            }, {
                name: "removedeptconfirm",
                type: "list",
                message: "CONFIRM deletion of department.",
                choices: ["Yes", "No"]
            }).then(function (answer) {
                if (answer.removedeptconfirm === "No") {
                    restartApp();
                } else {
                    connection.query(
                        "DELETE FROM department WHERE name = ?",
                        answer.removedepttitle,
                        function (err, res) {
                            if (err) throw err;
                            if (res.affectedRows === 0) {
                                console.log("! ERROR deleting department.");
                                restartApp();
                            } else {
                                console.log("$ SUCCESSFULLY deleted department '" + answer.removedepttitle + "'");
                                restartApp();
                            }
                        });
                }
            });
        });
}

// FUNCTION ALLOWS YOU TO ADD A DEPARTMENT, WILL CONSOLE LOG ALL CURRENT DEPARTMENTS BEFORE YOU ENTER SO YOU CAN MAKE SURE DUPLICATE IS NOT ADDED
function addDepartment() {
    connection.query(
        "SELECT name FROM department",
        function (err, res) {
            if (err) throw res;
            let departmenttitles = [];
            for (let i = 0; i < res.length; i++) {
                departmenttitles.push(res[i].name);
            }
            console.log("\n CURRENT DEPARTMENTS: " + departmenttitles.toString() + "\n")
            inquirer.prompt({
                name: "adddepttitle",
                type: "input",
                message: "Enter a name for the new department."
            }).then(async function (answer) {
                connection.query(
                    "INSERT INTO department SET name = ?",
                    answer.adddepttitle,
                    function (err, res) {
                        if (err) throw err;
                        if (res.affectedRows === 0) {
                            console.log("! ERROR adding department, please try again.");
                        } else {
                            console.log("$ SUCCESSFULLY added department '" + answer.adddepttitle + "'");
                        }
                        restartApp();
                    });
            });
        });
}

// SHOWS ALL CURRENT ROLES
function viewRoles() {
    connection.query(
        "SELECT title AS 'Job Title', salary AS 'Salary' FROM role",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            restartApp();
        });
}

// FUNCTION REMOVES SELECTED ROLE, WILL ASK FOR CONFIRMATION, AND ANYTHING RELIANT ON ROLE WILL BE SET AS NULL AS PER SCHEMA
function removeRole() {
    connection.query(
        "SELECT title FROM role",
        function (err, res) {
            let roletitles = [];
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                roletitles.push(res[i].title);
            }
            inquirer.prompt([{
                name: "selectrole",
                type: "list",
                message: "Select role to delete.",
                choices: roletitles
            }, {
                name: "confirmroledelete",
                type: "list",
                message: "CONFIRM deletion of role.",
                choices: ["Yes", "No"]
            }]).then(async function (answer) {
                if (answer.confirmroledelete === "No") {
                    restartApp();
                } else {
                    connection.query(
                        "DELETE FROM role WHERE title = ?",
                        answer.selectrole,
                        function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            restartApp();
                        });
                }
            });

        });
}

// FUNCTION TO ADD A ROLE AND AN ASSOCIATED SALARY/DEPARTMENT
function addRole() {
    connection.query(
        "SELECT title FROM role",
        function (err, res) {
            let roletitles = [];
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                roletitles.push(res[i].title);
            }
            console.log("\n CURRENT ROLES: " + roletitles.toString() + "\n");
            connection.query(
                "SELECT name FROM department",
                function (err, res) {
                    if (err) throw err;
                    inquirer.prompt([{
                        name: "addroletitle",
                        type: "input",
                        message: "Enter the title of the role you would like to add."
                    }, {
                        name: "addrolesalary",
                        type: "number",
                        message: "Enter the salary for the role you would like to add."
                    }, {
                        name: "addroledepartment",
                        type: "list",
                        message: "Select a department to assign this role to.",
                        choices: listdepartments()
                    }]).then(async function (answer) {
                        connection.query(
                            "SELECT id FROM department WHERE name = ?",
                            answer.addroledepartment,
                            function (err, res) {
                                if (err) throw err;
                                let deptid = res[0].id;
                                connection.query(
                                    "INSERT INTO role SET ?", {
                                        title: answer.addroletitle,
                                        salary: answer.addrolesalary,
                                        department_id: deptid
                                    },
                                    function (err, res) {
                                        if (err) throw err;
                                        if (res.affectedRows === 0) {
                                            console.log("! ERROR adding role, please try again.");
                                        } else {
                                            console.log("$ SUCCESSFULLY added role " + answer.addroletitle);
                                        }
                                    });
                                restartApp();
                            });
                    });
                });
        });
}

// FUNCTION TO ADD NEW EMPLOYEE

function addEmployee() {
    let emprole;
    inquirer.prompt(addEmployeeQuestions)
        .then(async function (answer) {
            let managerchoice = answer.employeeMgmtId;
            let mgmtvalue = managerchoice.split(" ");
            let managerFirstName = mgmtvalue.shift();
            let managerLastName = mgmtvalue.join(' ');
            let managerid;
            connection.query(
                "SELECT id FROM role WHERE title = ?",
                answer.employeeRole,
                function (err, res) {
                    if (err) throw err;
                    emprole = res[0].id;
                    connection.query(
                        "SELECT id FROM employee WHERE first_name = ? AND last_name = ?",
                        [managerFirstName, managerLastName],
                        function (err, res) {
                            if (err) throw err;
                            managerid = res[0].id;
                            connection.query(
                                "INSERT INTO employee SET ?", {
                                    first_name: answer.employeeFirstName,
                                    last_name: answer.employeeLastName,
                                    role_id: emprole,
                                    manager_id: managerid
                                },
                                function (err, res) {
                                    if (err) throw err;
                                    console.log("$ SUCCESSFULLY added employee " + answer.employeeFirstName + " " + answer.employeeLastName);
                                    restartApp();
                                });
                        });
                });
        });
}

// FUNCTION TO VIEW ALL EMPLOYEES
function viewEmployees() {
    let query = "SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title as 'Job Title' FROM employee JOIN role ON employee.role_id = role.id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        restartApp();
    });
}

// FUNCTION TO VIEW ALL EMPLOYEES IN SELECTED DEPARTMENT
function viewByDept(){
    inquirer.prompt(chooseDepartment)
    .then(async function(answer){
        connection.query(
            "SELECT id FROM department WHERE name = ?",
            answer.chooseDepartment,
            function(err,res){
                if (err) throw err;
                let deptid = res[0].id;
                connection.query(
                    "SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Job Title', salary AS 'alary' FROM employee INNER JOIN role on employee.role_id = role.id WHERE department_id = ?",
                    
                    deptid,
                    function(err,res){
                        if (err) throw err;
                        console.table(res);
                        restartApp();
                    });
            });
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
                type: "list",
                message: "Select the employee whose role you would like to update.",
                choices: employees
            }).then(async function (answer) {
                let values = answer.chooseEmployee.split(" ");
                let employeeFirstName = values.shift();
                let employeeLastName = values.join(' ');
                let rolearray = [];
                connection.query(
                    "SELECT title FROM role",
                    function (err, res) {
                        if (err) throw err;
                        for (i = 0; i < res.length; i++) {
                            rolearray.push(res[i].title);
                        }
                        inquirer.prompt({
                            name: "chooseRole",
                            type: "list",
                            message: "Select the role you would like to assign this employee to.",
                            choices: rolearray
                        }).then(async function (answer) {
                            connection.query(
                                "SELECT id FROM role WHERE title = ?",
                                answer.chooseRole,
                                function (err, res) {
                                    if (err) throw err;
                                    let rolechoice = res[0].id;
                                    connection.query(
                                        "UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?",
                                        [rolechoice, employeeFirstName, employeeLastName],
                                        function (err, res) {
                                            if (err) throw err;
                                            if (res.affectedRows === 0) {
                                                console.log("! ERROR updating employee role - please try again.");
                                            } else {
                                                console.log("$ SUCCESSFULLY updated role for employee " + employeeFirstName + " " + employeeLastName + " to '" + answer.chooseRole + "'");
                                            }
                                            restartApp();
                                        });
                                });
                        });
                    });
            });
        });
}

function updateManager() {
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
                let employeeLastName = values.join(" ");
                managers = [];
                connection.query(
                    "SELECT * FROM employee WHERE manager_id IS NULL",
                    function (err, res) {
                        if (err) throw err;
                        for (i = 0; i < res.length; i++) {
                            managers.push(res[i].first_name + " " + res[i].last_name);
                        }
                        inquirer.prompt({
                            name: "changemanager",
                            type: "list",
                            message: "Select the manager you would like " + employeepick + " to be assigned to.",
                            choices: managers
                        }).then(function (answer) {
                            let managerpick = answer.changemanager;
                            let values = managerpick.split(" ");
                            let managerFirstName = values.shift();
                            let managerLastName = values.join(" ");
                            connection.query(
                                "SELECT id FROM employee WHERE first_name = ? AND last_name = ?",
                                [managerFirstName, managerLastName],
                                function (err, res) {
                                    if (err) throw err;
                                    let managerid = res[0].id;
                                    connection.query(
                                        "UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?",
                                        [managerid, employeeFirstName, employeeLastName],
                                        function (err, res) {
                                            if (err) throw err;
                                            if (res.affectedRows === 0) {
                                                console.log("! Error, please try again.");
                                            } else {
                                                console.log("Successfully updated employee: manager for " + employeepick + " changed to " + managerpick + ".");
                                            }
                                            restartApp();
                                        });
                                });
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
                            "SELECT employee.id, employee.first_name, employee.last_name, department.name FROM employee INNER JOIN department ON employee.role_id = department.id WHERE manager_id = ? ORDER BY last_name",
                            managerid,
                            function (err, res) {
                                if (err) throw err;
                                console.table(res);
                                restartApp();
                            });
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

function listroles() {
    let roles = [];
    connection.query(
        "SELECT title FROM role",
        function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                roles.push(res[i].title)
            }
        });
    return roles;
}

function listdepartments() {
    let departments = [];
    connection.query(
        "SELECT name FROM department",
        function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                departments.push(res[i].name);
            }
        });
    return departments;
}

init();