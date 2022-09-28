const inquirer = require("inquirer");

const mainMenu = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "menuchoice",
                message: "Select what would you like to do? When done, choose exit. ",
                choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"],
            }
        ])
        .then((selectedTask) => {
            let task = "";
            task = selectedTask.menuchoice;
            checkTask(task);
        });

}