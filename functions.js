const inquirer = require("inquirer");
const connection = require("./connection")

// const {addDepartment, listRole, addEmployee} = require("./addfunctions");


//User can select what to do
const mainMenu = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "menuchoice",
                message: "Select what would you like to do? When done, choose exit. ",
                choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "show manager", "Exit"],
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
            getRole();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Update an employee role":
            getEmployeeInfo();
            break;
        case "show manager":
            showManager();
            break;
        default:
            process.exit();


    }

};

const showDepartment = () => {
    connection.query("SELECT * FROM department", function (err, result) {
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
    connection.query("SELECT * FROM role", function (err, results) {
        console.table(results)
        mainMenu();
    });
};

const showEmployee = () => {
    connection.query("SELECT * FROM employee", function (err, result) {
        console.table(result);
        mainMenu();
    });
};

const showManager = () => {
    connection.query("SELECT * FROM manager", function (err, result) {
        console.table(result);
        mainMenu();
    });
};

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

const getRole = () => {
    connection.query("SELECT name FROM department", function (err, result) {
        depArray = [];
        for (let i in result) {
            if (err) throw err;
            depArray.push(result[i].name)
        }
        listRole(depArray)

    })
}

const listRole = (depArray) => {
    const roleArray = [];
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
                choices: depArray,
            }
        ])
        .then((role) => {
            const nameOfRole = role.roleName;
            const salaryString = role.roleSalary;
            const salaryOfRole = (parseInt(salaryString));
            const departmentOfRole = role.roleDepartmentID;
            roleArray.push(nameOfRole, salaryString, salaryOfRole, departmentOfRole);
            addRole(roleArray);
        })
};

const addRole = (roleArray) => {
    connection.query(`SELECT id FROM department WHERE name = "${roleArray[3]}"`, function (err, result) {
        const role_id = result[0].id
        toInsert = `INSERT INTO role (title, salary, department_id) VALUES ("${roleArray[0]}", "${roleArray[1]}", "${role_id}" )`;
        connection.query(toInsert, function (err, result) {
            if (err) throw err;
            console.log(`${roleArray[0]} added to the database`);
            mainMenu();
        })
    })
};

const addEmployee = () => {
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
                type: "input",
                message: "What is the role of the employee?",
                name: "employeeRole",
            },
            {
                type: "input",
                message: "Who is the manager of the employee?",
                name: "employeeManager",
            },
        ])
        .then((employee) => {
            const firstName = employee.firstName;
            const lastName = employee.lastName;
            const employeeRole = employee.employeeRole;
            const employeeManager = employee.employeeManager;
            const splitName = employeeManager.split(" ");
           if (employeeManager === "") {
            employeeInfo.push(firstName, lastName, employeeRole, "0");
                insertEmployee(employeeInfo)
           } else {
               connection.query(`SELECT man_id FROM manager WHERE last_name = "${splitName[1]}"`, function (err, res) {
                   const manID = res[0].man_id;
                   employeeInfo.push(firstName, lastName, employeeRole, manID);
                   insertEmployee(employeeInfo);
                })
           }
        })
};

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
// const listEmployee = () => {
//     connection.query("Select first_name, last_name FROM employee", function (err, result) {
//         const empArray = [];
//         for (let i in result) {
//             const tempList = [];
//             if (err) throw err;
//             tempList.push(result[i].first_name, result[i].last_name);
//             const empNames = tempList.join(" ")
//             empArray.push(empNames)
//         }
//         updateEmployee(empArray)

//     })
// }

// const roleIDforEmployee = () => {
//     connection.query("SELECT name FROM department", function (err, result) {
//         depArray = [];
//         for (let i in result) {
//             if (err) throw err;
//             depArray.push(result[i].name)
//         }
//         listRole(depArray)

//     })
// }

const getEmployeeInfo = () => {
    const updateArray = [];
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the first name of the employee?",
                name: "updateFirstName",
            },
            {
                type: "input",
                message: "What is the last name of the employee?",
                name: "updateLastName",
            },
            {
                type: "input",
                message: "What is the new role of the employee?",
                name: "updateRole",
            },
            {
                type: "input",
                message: "Who is the new manager of the employee?",
                name: "updateManager",
            }
        ])
        .then((update) => {
            const first_name = update.updateFirstName;
            const last_name = update.updateLastName;
            const newRole = update.updateRole;
            const newManager = update.updateManager;
            updateArray.push(first_name, last_name, newRole, newManager)
            getManagerID(updateArray)
        })


};

const getManagerID = (updateArray) => {
    let managerID = [];   
    const splitName = updateArray[3].split(" ");
        connection.query(`SELECT man_id FROM manager WHERE last_name = "${splitName[1]}"`, function (err, res) {
            const manID = res[0].man_id;
            managerID.push(manID)
        })   
        updateEmployee(managerID, updateArray)
}

const updateEmployee = (managerID, updateArray) => {
    
    connection.query(`SELECT id FROM employee WHERE last_name = "${updateArray[1]}"`, function (err, res) {
        const employeeID = res[0].id
        connection.query(`SELECT id FROM role WHERE title = "${updateArray[2]}"`, function (err, result) {
            const role_id = result[0].id
            toInsert = `UPDATE employee SET role_id = "${role_id}", manager_id = "${managerID}" WHERE id = "${employeeID}"`;
            connection.query(toInsert, function (err, result) {
                if (err) throw err;
                console.log(`${updateArray[0]} ${updateArray[1]} updated in the database`);
                mainMenu();
            })
        })
    })
};

module.exports = {
    mainMenu
};