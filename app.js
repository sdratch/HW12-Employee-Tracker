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
  init();
});

function init() {
  inquirer
    .prompt([
      {
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
        case "Exit":
          connection.end();
          break;
      }
    });
}

function viewEmployees() {
  let queryString = `select e.id,e.first_name,e.last_name,title,name,salary,
    CONCAT(m.first_name, " " , m.last_name) AS "manager"
    from employee e
    inner join role on e.role_id = role.id
    inner join department on role.department_id = department.id
    LEFT join employee m ON m.id = e.manager_id
    order by e.id;`;
  connection.query(queryString, (err, res) => {
    if (err) throw err;
    formatEmployees(res);
  });
}

function addEmployee() {
  let queryString = `select * from employee;`;
  connection.query(queryString, (err, employee) => {
    if (err) throw err;
    queryString = `select * from role;`;
    connection.query(queryString, (err, role) => {
      if (err) throw err;

      let roleTitle = [];
      for (let i = 0; i < role.length; i++) {
        roleTitle.push(role[i].title);
      }
      let employeeName = [];
      for (let i = 0; i < employee.length; i++) {
        employeeName.push(
          employee[i].first_name + ", " + employee[i].last_name
        );
      }
      employeeName.push("No one");
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
            message: "Enter employee's first name",
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
          let managerId = employee.filter(
            (obj) => obj.first_name + ", " + obj.last_name === manager
          );
          if (managerId.length === 0) {
            managerId = null;
          } else {
            managerId = managerId[0].id;
          }
          const roleId = role.filter((obj) => obj.title === newRole)[0].id;
          queryString = `insert into employee(first_name,last_name,role_id,manager_id) values(?,?,?,?)`;
          connection.query(
            queryString,
            [firstName, lastName, roleId, managerId],
            (err) => {
              if (err) throw err;
              init();
            }
          );
        });
    });
  });
}
function updateEmployeeRole() {
  let queryString = `select * from employee;`;
  connection.query(queryString, (err, employeeList) => {
    queryString = `select * from role;`;
    connection.query(queryString, (err, role) => {
      let roleTitle = [];
      for (let i = 0; i < role.length; i++) {
        roleTitle.push(role[i].title);
      }
      let employeeName = [];
      for (let i = 0; i < employeeList.length; i++) {
        employeeName.push(
          employeeList[i].first_name + ", " + employeeList[i].last_name
        );
      }
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
          const employeeId = employeeList.filter(
            (obj) => obj.first_name + ", " + obj.last_name === employee
          )[0].id;
          const roleId = role.filter((obj) => obj.title === newRole)[0].id;
          console.log(employeeId), console.log(roleId);
          queryString = `update employee
        set role_id = ?
        WHERE id = ? `;
          connection.query(queryString, [employeeId, roleId], (err) => {
            if (err) throw err;
            init();
          });
        });
    });
  });
}
function viewRoles() {
  let queryString = `select role.id,title,name,salary
    from role
    inner join department on role.department_id = department.id
    order by role.id;`;
  connection.query(queryString, (err, res) => {
    if (err) throw err;
    formatRoles(res);
  });
}
function addRoles() {
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
      let queryString = `select * from department;`;
      connection.query(queryString, (err, res) => {
        if (err) throw err;
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
            const departmentId = res.filter((obj) => obj.name === department)[0]
              .id;
            console.log(departmentId);
            let queryString = `insert into role(title,salary,department_id) values(?,?,?)`;
            connection.query(
              queryString,
              [title, salary, departmentId],
              (err) => {
                if (err) throw err;
                init();
              }
            );
          });
      });
    });
}
function viewDepartment() {
  let queryString = `select * from department
  order by id;`;
  connection.query(queryString, (err, res) => {
    if (err) throw err;
    formatDepartment(res);
  });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter name of new department",
      },
    ])
    .then(({ name }) => {
      let queryString = `insert into department(name) values(?)`;
      connection.query(queryString, [name], (err) => {
        if (err) throw err;
        init();
      });
    });
}
function formatEmployees(res) {
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
  console.log(table.toString());
  init();
}
function formatRoles(res) {
  let table = new Table();
  res.forEach((role) => {
    table.cell("id", role.id);
    table.cell("Title", role.title);
    table.cell("Department", role.name);
    table.cell("Salary", role.salary);
    table.newRow();
  });
  console.log(table.toString());
  init();
}
function formatDepartment(res) {
  let table = new Table();
  res.forEach((department) => {
    table.cell("id", department.id);
    table.cell("Department", department.name);
    table.newRow();
  });
  console.log(table.toString());
  init();
}
