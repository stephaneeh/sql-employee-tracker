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
employee_tracker = () => {
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
                console.log("Showing all departments: ");
                console.table(result);
                employee_tracker();
            });
          } else if (answers.prompt === 'Show all roles') {
              db.query(`SELECT * FROM roles`, (err, result) => {
                if (err) throw err;
                console.log("Showing all roles: ");
                console.table(result);
                employee_tracker();
            });
            // } else if (answers.prompt === 'Show all employees') {
            //   //FIXME: only bring back what is needed
            //   // presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to  
                        

            //   db.query(`SELECT employees.id, employees.first_name, employees.last_name, department.department_name, roles.title, roles.salary FROM employees, roles, department`, (err, result) => {
            //     if (err) throw err;
            //     console.log("Showing all employees: ");
            //     console.table(result);
            //     employee_tracker();
            // });
            } else if (answers.prompt === 'Add a new department') {
                addDepartment();
            } else if (answers.prompt === 'Add a new role') {
                addRole();
            // } else if (answers.prompt === 'Add a new employee') {
            //     addEmployee();
            // } else if (answers.prompt === 'Update an employee') {
            //     updateEmployee();     
    } else if (answers.prompt === 'Exit') {
        db.end();
        console.log("Thank you for your help!");
        process.exit(0);
    }
})};


addDepartment = () => {
  inquirer.prompt([
    {
      type:'input',
      name:'department',
      message:'What is the name of your new department?',
    }
  ])
  .then(answer => {
    db.query(`INSERT INTO department (department_name) VALUES (?)`, answer.department, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log('You have successfully added ' + answer.department + " to departments");
      employee_tracker();
    });
  });
};

addRole = () => {
  inquirer.prompt([
    {
      type:'input',
      name:'title',
      message:'What is the title of the new role?',
    },
    {
      type:'input',
      name:'salary',
      message:'What is the base salary of the new role?',
    }
  ])
  .then(answer => {
    db.query(`SELECT id, department_name FROM department`, (err, results) => {
      if (err) return console.log(err);
      const depID = results.map((dep) => { return  {name: dep.department_name, value: dep.id }});

      inquirer.prompt([
        {
          type:'list',
          name:'department',
          message:'Which department does this role belong to?',
          choices: depID
        }
      ]).then(depIDResult => {
        db.query(`INSERT INTO roles (id, title, salary, department_id) VALUES (?,?,?,?)`, [answer.roleId, answer.title, answer.salary, depIDResult.department],(err, results) => {
          if (err) {
            console.log(err);
          }
          console.log('Successfully added ' + answer.title +  ' to roles');
          employee_tracker();
        });
      });
    }); 
  }); 
}

// -------------------------------- functions --------------------------------
          // WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to  
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
 


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);


       
  