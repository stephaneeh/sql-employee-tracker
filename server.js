const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker_db'
  });

db.connect(function(err) {
    if (err) throw err;
    console.log(`Connected to the employee_tracker_db database.`);
    console.log(`Starting Employee Tracker.`);
    console.log(`
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    
________               ___                       _________           ___            
|  ____|               | |                       |__   __|           | |            
| |__   _ __ ___  _ __ | | ___  _   _  ___  ___     | |_ __ __ _  ___| | _____ _ __ 
|  __| | __  __ \\| __ \\| |/ _ \\| | | |/ _ \\/ _ \\    | | ___/ __ |/ __| |/ / _ \\ ___|
| |____| | | | | | |_) | | (_) | |_| |  __/  __/    | | | | (_| | (__|   <  __/ |   
|______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|    |_|_|  \\__,_|\\___|_|\\_\\___|_|   
                 | |             __/ |                                              
                 |_|            |____/                                               


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            `);
    employee_tracker();
  });



//run inquirer for user prompts to create database
function employee_tracker () {
    inquirer.prompt ([
        {   
            type: 'list',
            name: 'prompt',
            message: 'What would you like to do?',
            choices: ['Show all departments', 'Show all roles', 'Show all employees', 'Add a new department', 'Add a new role', 'Add a new employee', 'Update an employee role', 'Exit'],
          }]).then((answers) => {
            if (answers.prompt === 'Show all departments') {
              db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Departments: ");
                console.table(result);
                employee_tracker();
            });
          } else if (answers.prompt === 'Show all roles') {
              db.query(`SELECT * FROM roles`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Roles: ");
                console.table(result);
                employee_tracker();
            });
          } else if (answers.prompt === 'Show all employees') {
            db.query(`SELECT * FROM employees`, (err, result) => {
              if (err) throw err;
              console.log("Viewing All Employees: ");
              console.table(result);
              employee_tracker();
          });
            // } else if (answers.prompt === 'Add a new department') {
            //     addDepartment();
            // } else if (answers.prompt === 'Add a new role') {
            //     addRole();
            // } else if (answers.prompt === 'Add a new employee') {
            //     addEmployee();
            // } else if (answers.prompt === 'Update an employee') {
            //     updateEmployee();     
    } else if (answers.prompt === 'Finish') {
        db.end();
        
        console.log("Thank you for your help!");
    }
})};

// -------------------------------- functions --------------------------------
// const showDepartment = () => {
//   return db.query("SELECT * FROM department");
// }

// presented with a formatted table showing department names and department ids 

// showRoles();
// // presented with the job title, role id, the department that role belongs to, and the salary for that role

// showEmployees();
// // presented with a formatted table showing employee data, 
// // including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// addDepartment();
// // prompted to enter the name of the department and that department is added to the database

// addRole();
// // prompted to enter the name, salary, and department for the role and that role is added to the database

// addEmployee();
// // prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// updateEmployee();  
// // prompted to select an employee to update and their new role and this information is updated in the database 
 


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);


       
  