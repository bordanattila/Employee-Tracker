const inquirer = require("inquirer");
const connection = require("./connection");

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "departmentName",
            }
        ])
        .then((department) => {
            const depName = department.departmentName;
            toInsert = `INSERT INTO department (name) VALUES ("${depName}")`;
            connection.query(toInsert, function (err, result) {
                if (err) throw err;
                console.log(`${depName} added to the database`)
                mainMenu();
            })
        })
};

const listRole = () => {
    connection.query("SELECT name FROM department", function (err, result) {
        depArray = [];
        for (let i in result) {
            if (err) throw err;
            depArray.push(result[i].name)
        }
        addRole(depArray)
        
    })
}
const addRole = (depArray) => {    
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the role?",
                name: "roleName",
            },
            {
                type: "input",
                message: "What is the salary of the role?",
                name: "roleSalary",
            },
            {
                type: "list",
                message: "which department does the role belong to?",
                name: "roleDepartmentID",
                choices: depArray,
            }
        ])
        .then((role) => {
            const nameOfRole = role.roleName;
            const salaryString = role.roleSalary
            const salaryOfRole = (parseInt(salaryString));
            const departmentOfRole = 1
            toInsert = `INSERT INTO role (title, salary, department_id) VALUES ("${nameOfRole}", "${salaryOfRole}", "${departmentOfRole}" )`;
            connection.query(toInsert, function (err, result) {
                if (err) throw err;
                console.log(`${nameOfRole} added to the database`)
                mainMenu();
            })
        })
};

const addEmployee = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "departmentName",
            }
        ])
        .then((department) => {
            const depName = department.departmentName;
            toInsert = `INSERT INTO department (name) VALUES ("${depName}")`;
            connection.query(toInsert, function (err, result) {
                if (err) throw err;
                console.log(`${depName} added to the database`)
                mainMenu();
            })
        })
};

module.exports = {
    addDepartment,
    listRole,
    addEmployee,
}