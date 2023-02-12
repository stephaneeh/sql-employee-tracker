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
    employee_tracker();
  });

//run inquirer for user prompts to create database
var employee_tracker = function () {
    console.log(`
- - - - - - - - - - - - - - - - 
    
LETS LOOK AT YOUR COMPANY
    
- - - - - - - - - - - - - - - - 
        `);
    inquirer.prompt ([
        {   
            type: 'list',
            name: 'prompt',
            message: 'What would you like to do?',
            choices: ['Show all departments', 'Show all roles', 'Show all employees', 'Add a new department', 'Add a new role', 'Add a new employee', 'Update an employee role', 'Finish'],
        }]).then((answers) => {
            if (answers.prompt === 'Show all departments') {
                db.query(`SELECT * FROM department`, (err, result) => {
                    if (err) throw err;
                    console.log("Showing all departments: ");
                    console.table(result);
                    employee_tracker();
                });
            } else if (answers.prompt === 'Show all roles') {
                db.query(`SELECT * FROM role`, (err, result) => {
                    if (err) throw err;
                    console.log("Showing all roles: ");
                    console.table(result);
                    employee_tracker();
                });
            } else if (answers.prompt === 'Show all employees') {
                db.query(`SELECT * FROM employee`, (err, result) => {
                    if (err) throw err;
                    console.log("Showing all employees: ");
                    console.table(result);
                    employee_tracker();
                });
    } else if (answers.prompt === 'Finish') {
        db.end();
        console.log("Thank you for your help!");
    }
})};

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);


                
//questison to ask
// What would you like to do
    // view all departments, 
        // presented with a formatted table showing department names and department ids 
    // view all roles, 
        // presented with the job title, role id, the department that role belongs to, and the salary for that role
    // view all employees, 
        // presented with a formatted table showing employee data, 
            // including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    // add a department, 
        // prompted to enter the name of the department and that department is added to the database
    // add a role, 
        // prompted to enter the name, salary, and department for the role and that role is added to the database
    // add an employee, 
        // prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    // and update an employee role
        // prompted to select an employee to update and their new role and this information is updated in the database 