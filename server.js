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
            choices: ['Show all departments', 'Show all roles', 'Show all employees', 'Add a new department', 'Add a new role', 'Add a new employee', 'Update an employees role', 'Exit'],
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
              // showEmployees(); FIXME:
            } else if (answers.prompt === 'Add a new department') {
                addDepartment();
            } else if (answers.prompt === 'Add a new role') {
                addRole();
            } else if (answers.prompt === 'Add a new employee') {
                addEmployee();
            } else if (answers.prompt === 'Update an employees role') {
                updateEmployee();     
    } else if (answers.prompt === 'Exit') {
        db.end();
        console.log("Thank you for your help!");
        process.exit(0);
    }
})};



// -------------------------------- functions --------------------------------

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to 





// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
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

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
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

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
addEmployee = () => {
  inquirer.prompt([
    {
      type:'input',
      name:'firstName',
      message:'What is the first name of your new employee?',
    },
    {
      type:'input',
      name:'lastName',
      message:'What is the last name of your new employee?',
    },
  ])
  .then(answer => {
    db.query(`SELECT id, title FROM roles`, (err, results) => {
      if (err) return console.log(err);
      const roleID = results.map((roles) => { return  {name: roles.title, value: roles.id }});

      inquirer.prompt([
        {
          type:'list',
          name:'title',
          message:'What is the job title for this employee?',
          choices: roleID
        }
      ]).then(roleIDResult => {
        //select list of managers available and provide as prompt for choice
          db.query(`SELECT first_name, last_name, id FROM employees`, (err, results) => {
            if (err) return console.log(err);
            const manager = results.map((emp) => { return  {name: emp.first_name + ' ' + emp.last_name, value: emp.id }});
            const managerList = {name:'null', value:0};
            manager.push(managerList);

            inquirer.prompt([
              {
                type:'list',
                name:'manager',
                message:'Who is the manager for this employee?',
                choices: manager
              }
            ]).then(managerResults => {
              //add employee to employees table with manager info included
              db.query(`INSERT INTO employees (first_name, last_name,role_id, manager_id) VALUES (?,?,?,?)`, [answer.firstName, answer.lastName, roleIDResult.title, managerResults.manager],(err, results) => {
                if (err) {
                  console.log(err);
                }
                console.log('Successfully added ' + answer.firstName + ' '+ answer.lastName +  ' to employees');
                employee_tracker();
              });
            });
          });
        });
      });
    });
  };
        
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
updateEmployee = () => {
  //pull the list of employees to be selected  
  db.query(`SELECT id, first_name, last_name FROM employees`, (err, results) => {
      if (err) return console.log(err);
      const employeeResults = results.map((emp) => { return  {name: emp.first_name + " " + emp.last_name, value: emp.id }});

      inquirer.prompt([
        {
          type:'list',
          name:'employee',
          message:'Which employee would you like to update?',
          choices: employeeResults
        }
      ]).then(employeeAnswer => {
        //return list of roles to update for the employee
          db.query(`SELECT id, title FROM roles`, (err, results) => {
            if (err) return console.log(err);
            const roleResults = results.map((roles) => { return  {name: roles.title, value: roles.id }});

            inquirer.prompt([
              {
                type:'list',
                name:'roles',
                message:'What is the new role for this employee?',
                choices: roleResults
              }
            ]).then(rolesAnswer => {
              //update role for employee selected
              db.query(`UPDATE employees set role_id = (?) WHERE id = (?)`, [rolesAnswer.roles, employeeAnswer.employee],(err, results) => {
                if (err) {
                  console.log(err);
                }
                console.log('Successfully updated to role id ' + rolesAnswer.roles);
                employee_tracker();
              });
            });
          });
        });
      });
    };





// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);


       
  