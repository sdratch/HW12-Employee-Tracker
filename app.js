const mysql = require("mysql");
const inquirer = require("inquirer")
const Table = require('easy-table')

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
  viewEmployees()
});

function viewEmployees(){
    let queryString = `select e.id,e.first_name,e.last_name,title,name,salary,
    CONCAT(m.first_name, " " , m.last_name) AS "manager"
    from employee e
    inner join role on e.role_id = role.id
    inner join department on role.department_id = department.id
    inner join employee m ON m.id = e.manager_id;`

    connection.query(queryString,(err,res)=>{
        formatTable(res)
        
    })
}

function formatTable(res){
  let table = new Table;
  res.forEach((employee) =>{
      table.cell('id',employee.id)
      table.cell('First Name',employee.first_name)
      table.cell('Last Name',employee.last_name)
      table.cell('Title',employee.title)
      table.cell('Department',employee.name)
      table.cell('Salary',employee.salary)
      table.cell('Manager',employee.manager)
      table.newRow()
  })
  console.log(table.toString())
}
//id,fn,ln,title,dep,sal,man