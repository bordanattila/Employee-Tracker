const inquirer = require("inquirer");
const connection = require("./connection")
const cTable = require('console.table');

// const {addDepartment, listRole, addEmployee} = require("./addfunctions");


//User can select what to do
const mainMenu = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "menuchoice",
                message: "Select what would you like to do? When done, choose exit. ",
                choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Update an employee's manager", "Exit"],
            }
        ])
        .then((selectedTask) => {
            let task = "";
            task = selectedTask.menuchoice;
            checkTask(task);
        });

}

const checkTask = (task) => {
    switch (task) {
        case "View all departments":
            showDepartment();
            break;
        case "View all roles":
            showRole();
            break;
        case "View all employees":
            showEmployee();
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            getRoleInfo();
            break;
        case "Add an employee":
            getNewEmployeeInfo();
            break;
        case "Update an employee role":
            getUpdateInfo();
            break;
        case "Update an employee's manager":
            getManagerUpdateInfo();
            break;
        default:
            process.exit();


    }

};

const showDepartment = () => {
    connection.query("SELECT id, name FROM department", function (err, result) {
        const array = result;
        // console.log(array);
        // const removeIndex = array.reduce((acc, {id, ...x}) => {acc[id] = x; return acc}, {});
        // console.log(removeIndex[0]);
        // console.table(removeIndex = array.reduce((acc, {index, ...x}) => {acc[index] = x; return acc}, {}));
        console.table(result)
        mainMenu();
    });
};

const showRole = () => {
    connection.query("SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id", function (err, results) {
        console.table(results)
        mainMenu();
    });
};

const showEmployee = () => {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM company_db.employee AS employee JOIN company_db.employee AS manager ON (employee.manager_id = manager.id) inner join company_db.role AS role ON employee.role_id = role.id inner join company_db.department AS department ON role.department_id = department.id", function (err, result) {
        console.table(result);
        mainMenu();
    });
};

// Add new department
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
                console.log(`${depName} department added to the database`)
                mainMenu();
            })
        })
};

// Create list of existing departments
const departmentArray = []
const makeDepartmentList = () => {
    connection.query("SELECT name FROM department", function (err, result) {
        for (let i in result) {
            if (err) throw err;
            departmentArray.push(result[i].name)
        }
    })
}

// Create list of existing roles
const roleArray = [];
const makeRoleList = () => {
    connection.query("SELECT title FROM role", function (err, result) {
        for (let i in result) {
            if (err) throw err;
            roleArray.push(result[i].title);
        }

    })
}

// Create list of existing managers 
const managerArray = [];
const makeManagerList = () => {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id <=> 0", function (err, result) {
        managerArray.push("None");
        for (let i in result) {
            const tempList = [];
            if (err) throw err;
            tempList.push(result[i].first_name, result[i].last_name);
            const managerNames = tempList.join(" ")
            managerArray.push(managerNames)
        }

    })
}

// Create list of existing employees 
const employeeArray = [];
const makeEmployeeList = () => {
    connection.query("SELECT first_name, last_name FROM employee", function (err, result) {
        for (let i in result) {
            const tempList = [];
            if (err) throw err;
            tempList.push(result[i].first_name, result[i].last_name);
            const employeeName = tempList.join(" ")
            employeeArray.push(employeeName)
        }
        console.log(employeeArray[0])
    })
}

// Collect infromation of the new role
const getRoleInfo = () => {
    makeDepartmentList();
    const newRoleArray = [];
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
                message: "Which department does the role belong to?",
                name: "roleDepartmentID",
                choices: departmentArray,
            }
        ])
        .then((role) => {
            const nameOfRole = role.roleName;
            const salaryString = role.roleSalary;
            const salaryOfRole = (parseInt(salaryString));
            const departmentOfRole = role.roleDepartmentID;
            newRoleArray.push(nameOfRole, salaryOfRole, departmentOfRole);
            addRole(newRoleArray);
        })
};

// Insert new role
const addRole = (newRoleArray) => {
    connection.query(`SELECT id FROM department WHERE name = "${newRoleArray[2]}"`, function (err, result) {
        const role_id = result[0].id
        toInsert = `INSERT INTO role (title, salary, department_id) VALUES ("${newRoleArray[0]}", "${newRoleArray[1]}", "${role_id}" )`;
        connection.query(toInsert, function (err, result) {
            if (err) throw err;
            console.log(`${newRoleArray[0]} added to the database`);
            mainMenu();
        })
    })
};

// Collect information for the new emplyee to insert
const getNewEmployeeInfo = () => {
    makeRoleList();
    makeManagerList();
    const employeeInfo = [];
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the first name of the employee?",
                name: "firstName",
            },
            {
                type: "input",
                message: "What is the last name of the employee?",
                name: "lastName",
            },
            {
                type: "list",
                message: "What is the role of the employee?",
                name: "employeeRole",
                choices: roleArray,
            },
            {
                type: "list",
                message: "Who is the manager of the employee?",
                name: "employeeManager",
                choices: managerArray,
            },
        ])
        .then((employee) => {
            const firstName = employee.firstName;
            const lastName = employee.lastName;
            const employeeRole = employee.employeeRole;
            const employeeManager = employee.employeeManager;
            const splitName = employeeManager.split(" ");
            if (employeeManager === "None") {
                employeeInfo.push(firstName, lastName, employeeRole, "0");
                insertEmployee(employeeInfo)
            } else {
                connection.query(`SELECT id FROM employee WHERE last_name = "${splitName[1]}"`, function (err, res) {
                    const manID = res[0].id;
                    employeeInfo.push(firstName, lastName, employeeRole, manID);
                    insertEmployee(employeeInfo);
                })
            }
        })
};

// Insert new employee with the given information
const insertEmployee = (employeeInfo) => {
    connection.query(`SELECT id FROM role WHERE title = "${employeeInfo[2]}"`, function (err, result) {
        const role_id = (result[0].id)
        toInsert = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${employeeInfo[0]}", "${employeeInfo[1]}", "${role_id}", "${employeeInfo[3]}")`;
        connection.query(toInsert, function (err, result) {
            if (err) throw err;
            console.log(`${employeeInfo[0]} ${employeeInfo[1]} added to the database`)
            mainMenu();
        })
    })
};

const callFunctions = new Promise((res, rej) => {
    let thepromise = true;
    if (!thepromise) {
        process.exit()
    } else {
        makeEmployeeList();
        makeRoleList();
        makeManagerList();
        res;
    }
})


// Collect information to update employee
const getUpdateInfo = () => {
    callFunctions
        .then

    const updateArray = [];
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee would you like to update?",
                name: "updateName",
                choices: employeeArray,
            },
            {
                type: "list",
                message: "What is the new role of the employee?",
                name: "updateRole",
                choices: roleArray,
            },
            {
                type: "list",
                message: "Who is the new manager of the employee?",
                name: "updateManager",
                choices: managerArray,
            }
        ])
        .then((update) => {
            const updateName = update.updateName;
            const newRole = update.updateRole;
            const newManager = update.updateManager;
            updateArray.push(updateName, newRole, newManager)
            getManagerID(updateArray)
        })


};

// Find ID of the manager
const getManagerID = (updateArray) => {
    let managerID = [];
    const splitName = updateArray[2].split(" ");
    connection.query(`SELECT id FROM employee WHERE last_name = "${splitName[1]}"`, function (err, res) {
        const manID = res[0].id;
        managerID.push(manID)
    })
    updateEmployee(managerID, updateArray)
}

// Update employee with new information
const updateEmployee = (managerID, updateArray) => {
    const splitName = updateArray[0].split(" ");
    connection.query(`SELECT id FROM employee WHERE last_name = "${splitName[1]}"`, function (err, res) {
        const employeeID = res[0].id
        connection.query(`SELECT id FROM role WHERE title = "${updateArray[1]}"`, function (err, result) {
            const role_id = result[0].id
            toInsert = `UPDATE employee SET role_id = "${role_id}", manager_id = "${managerID}" WHERE id = "${employeeID}"`;
            connection.query(toInsert, function (err, result) {
                if (err) throw err;
                console.log(`${updateArray[0]}'s information is updated in the database`);
                mainMenu();
            })
        })
    })
};

const getManagerUpdateInfo = () => {
    makeManagerList();
    makeManagerList();
    const managerUpdateArray = [];
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee's manager would you like to update?",
                name: "employeeToUpdate",
                choices: employeeArray,
            },
            {
                type: "list",
                message: "Who is the new manager?",
                name: "managerToUpdate",
                choices: managerArray,
            }
        ])
        .then((response) => {
            const employeeToUpdate = response.employeeToUpdate;
            const managerToUpdate = response.managerToUpdate;
            managerUpdateArray.push(employeeToUpdate, managerToUpdate)
            managerUpdate(managerUpdateArray)
        })
};

const managerUpdate = (managerUpdateArray) => {
    const splitName = managerUpdateArray[0].split(" ");
    const splitManager = managerUpdateArray[1].split(" ");
    connection.query(`SELECT id FROM employee WHERE last_name = "${splitName[1]}"`, function (err, response) {
        const employeeID = response[0].id;
        console.log(employeeID)
        connection.query(`SELECT id FROM employee WHERE last_name = "${splitManager[1]}"`, function (err, response) {
            const managerID = response[0].id;
            console.log(managerID)
            toInsert = `UPDATE employee SET manager_id = "${managerID}" WHERE id = "${employeeID}"`;
            connection.query(toInsert, function (err, res) {
                if (err) throw err;
                console.log(`${managerUpdateArray[0]}'s manager is updated`);
                mainMenu();
            })
        })
    })
};

const deleteEmployee = () => {
    
}

module.exports = {
    mainMenu
};