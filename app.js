const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("easy-table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "poiuy123",
  database: "employee_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  //start the program on connection
  init();
});

function init() {
  inquirer
    .prompt([
      {
        //ask user for a list of function that they want to use
        type: "list",
        name: "result",
        message: "What option would you like to preform?",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Department",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee's Role",
          "Exit",
        ],
      },
    ])
    .then((data) => {
      //use switch case to determine which function to run
      switch (data.result) {
        case "View All Employees":
          viewEmployees();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Department":
          viewDepartment();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRoles();
          break;
        case "Update an Employee's Role":
          updateEmployeeRole();
          break;
        //exit case to end program
        case "Exit":
          connection.end();
          break;
      }
    });
}
//view an employee and display them on a nice looking table
function viewEmployees() {
  //select the columns i want to show
  //since joining 2 employees need to label 1 e for employee and another m for manager
  //inner join the role with the role id
  //inner join the department with the department id and the role's department id
  //left join with the manager to still get employees without managers
  let queryString = `select e.id,e.first_name,e.last_name,title,name,salary, 
    CONCAT(m.first_name, " " , m.last_name) AS "manager"
    from employee e
    inner join role on e.role_id = role.id
    inner join department on role.department_id = department.id
    LEFT join employee m ON m.id = e.manager_id
    order by e.id;`;
  //query the string
  connection.query(queryString, (err, res) => {
    if (err) throw err;
    //use easy table to construct a nice looking table with the labeled columns
    let table = new Table();
    res.forEach((employee) => {
      table.cell("id", employee.id);
      table.cell("First Name", employee.first_name);
      table.cell("Last Name", employee.last_name);
      table.cell("Title", employee.title);
      table.cell("Department", employee.name);
      table.cell("Salary", employee.salary);
      table.cell("Manager", employee.manager);
      table.newRow();
    });
    //log the table
    console.log(table.toString());
    //go back to the start of the program
    init();
  });
}
//function to add an employee
function addEmployee() {
  //1st query to get all emplyees
  let queryString = `select * from employee;`;
  connection.query(queryString, (err, employee) => {
    if (err) throw err;
    //2nd query to get all roles
    queryString = `select * from role;`;
    connection.query(queryString, (err, role) => {
      if (err) throw err;

      //loop to get a list of role titles to be used in questons
      let roleTitle = [];
      for (let i = 0; i < role.length; i++) {
        roleTitle.push(role[i].title);
      }
      //loop to get all employee's name in first name, last name format
      let employeeName = [];
      for (let i = 0; i < employee.length; i++) {
        employeeName.push(
          employee[i].first_name + ", " + employee[i].last_name
        );
      }
      //add an option for having no manager
      employeeName.push("No one");
      //inquirer for the questions
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter employee's first name",
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter employee's last name",
          },
          {
            type: "list",
            name: "newRole",
            message: "Enter employee's role",
            choices: roleTitle,
          },
          {
            type: "list",
            name: "manager",
            message: "Enter employee's mangaer",
            choices: employeeName,
          },
        ])
        .then(({ firstName, lastName, newRole, manager }) => {
          //get the objcet of the manager
          let managerId = employee.filter(
            (obj) => obj.first_name + ", " + obj.last_name === manager
          );
          //make the managerId null if there option selected was no one
          if (managerId.length === 0) {
            managerId = null;
          } else {
            //get the manager id
            managerId = managerId[0].id;
          }
          //filter all the roles until the title of the role matches the one that was selected and get that id
          const roleId = role.filter((obj) => obj.title === newRole)[0].id;
          //query to insert new employee with the obtained values
          queryString = `insert into employee(first_name,last_name,role_id,manager_id) values(?,?,?,?)`;
          connection.query(
            queryString,
            [firstName, lastName, roleId, managerId],
            (err) => {
              if (err) throw err;
              //go back to the start of the program
              init();
            }
          );
        });
    });
  });
}
//function to update employee roles
function updateEmployeeRole() {
  //query to get all employees
  let queryString = `select * from employee;`;
  connection.query(queryString, (err, employeeList) => {
    //query to get all roles
    queryString = `select * from role;`;
    connection.query(queryString, (err, role) => {
      //make list of role titles
      let roleTitle = [];
      for (let i = 0; i < role.length; i++) {
        roleTitle.push(role[i].title);
      }
      //make list of employee name in format first name, last name
      let employeeName = [];
      for (let i = 0; i < employeeList.length; i++) {
        employeeName.push(
          employeeList[i].first_name + ", " + employeeList[i].last_name
        );
      }
      //message prompt the user
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee do you wish to update",
            choices: employeeName,
          },
          {
            type: "list",
            name: "newRole",
            message: "What is their new role",
            choices: roleTitle,
          },
        ])
        .then(({ employee, newRole }) => {
          //filter out the employee array to just the id of the employee the user selected
          const employeeId = employeeList.filter(
            (obj) => obj.first_name + ", " + obj.last_name === employee
          )[0].id;
          //filter out the list of roles to the id of the role that the user selected
          const roleId = role.filter((obj) => obj.title === newRole)[0].id;
          //query to update the employee to the new role
          queryString = `update employee
        set role_id = ?
        WHERE id = ? `;
          connection.query(queryString, [roleId, employeeId], (err) => {
            if (err) throw err;
            //go back to the start of the program
            init();
          });
        });
    });
  });
}
//funciton to view the role
function viewRoles() {
  //select the roles and inner join with the department to show the department name and not id
  let queryString = `select role.id,title,name,salary
    from role
    inner join department on role.department_id = department.id
    order by role.id;`;
  //send the query request
  connection.query(queryString, (err, res) => {
    if (err) throw err;
    //use easy table to construct a nice looking table with the labeled columns
    let table = new Table();
    res.forEach((role) => {
      table.cell("id", role.id);
      table.cell("Title", role.title);
      table.cell("Department", role.name);
      table.cell("Salary", role.salary);
      table.newRow();
    });
    //log the table
    console.log(table.toString());
    //go back to the start of the program
    init();
  });
}
//function to add roles
function addRoles() {
  //inquierer to get the title of new role and the salary of the new role
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter title of new role",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary of the role",
      },
    ])
    .then(({ title, salary }) => {
      //get the list of department
      let queryString = `select * from department;`;
      connection.query(queryString, (err, res) => {
        if (err) throw err;
        //ask the user what department the role is apart of
        inquirer
          .prompt([
            {
              type: "list",
              name: "department",
              message: "Enter which department the role belongs to",
              choices: res,
            },
          ])
          .then(({ department }) => {
            //filter out to find the id of the department that the user selected
            const departmentId = res.filter((obj) => obj.name === department)[0]
              .id;
            //query to insert the role into the role table
            let queryString = `insert into role(title,salary,department_id) values(?,?,?)`;
            connection.query(
              queryString,
              [title, salary, departmentId],
              (err) => {
                if (err) throw err;
                //go back to the start of the program
                init();
              }
            );
          });
      });
    });
}
//function to add departments
function addDepartment() {
    //prompt use for the new department name
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter name of new department",
      },
    ])
    .then(({ name }) => {
        //query for creating new department
      let queryString = `insert into department(name) values(?)`;
      connection.query(queryString, [name], (err) => {
        if (err) throw err;
        //go back to the start of the program
        init();
      });
    });
}

function viewDepartment() {
  //query for getting the departments
  let queryString = `select * from department
  order by id;`;
  connection.query(queryString, (err, res) => {
    if (err) throw err;
    //use easy table to construct a nice looking table with the labeled columns
    let table = new Table();
    res.forEach((department) => {
      table.cell("id", department.id);
      table.cell("Department", department.name);
      table.newRow();
    });
    //console log the table
    console.log(table.toString());
    //go back to the start of the program
    init();
  });
}
