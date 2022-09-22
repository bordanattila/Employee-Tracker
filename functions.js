const inquirer = require("inquirer");
const connection = require("./connection")
let task;

//User can select what to do
const mainMenu = () => {
    inquirer
    .prompt([
        {
            type: "list",
            name: "menuchoice",
            message: "Select what would you like to do? If done choose exit. ",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"],
        }
    ])
    .then((selectedTask) => {
        task = ""  ;
        task = selectedTask.menuchoice;
        checkTask(task);
    });

}

const checkTask = (task) => {
    let loop = true;
    while (loop) {       
        if (task === "View all departments") {
            showDepartment();
            break;
        } else if (task === "View all roles") {
            showRole();
            break;
        } else {
            loop = false;           
            console.log("exited application")
        }
        
    } 


        // switch (task) {
        //     case "View all department":
        //         showDepartment();
        //         break;
        //     case "View all roles":
        //         showRole();
        //         break;
        //     default:        
        //         loop = false;           
        //         break;
        
        
        // } 
    // }
}; 

const showDepartment = () => {
    console.log("all department");
    connection.query("SELECT * FROM department", function (err, results) {
     
        console.log(results)
    });
    mainMenu()
};

const showRole = () => {
    console.log("all role");
    mainMenu();
};

module.exports = {
    mainMenu
};