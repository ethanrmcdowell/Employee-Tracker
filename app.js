const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employee_tracker"
});

connection.connect(function(err){
    if (err) throw err;
    console.table([
        {"Hello Friend!": "WELCOME TO THE EMPLOYEE TRACKER!"}
    ]);
    init();
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
},{
    name: "employeeLastName",
    type: "input",
    message: "Enter the new employee's last name:"
},{
    name: "employeeRoleId",
    type: "number",
    message: "Enter the new employee's role ID number:"
},{
    name: "employeeMgmtId",
    type: "number",
    message: "Enter the new employee's manager's ID number:"
}];

function init(){
    inquirer.prompt(initQuestion)
    .then(async function(answer){
        switch (answer.intro){
            case "Add Employee":
                await inquirer.prompt(addEmployeeQuestions);
                init();
                break;
        }
    })
}