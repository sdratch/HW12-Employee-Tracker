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
  init()
});




function init(){
    inquirer.prompt([{
        type:"list",
        name:"result",
        message:"What option would you like to preform?",
        choices:["View All Employees","View All Roles","Exit"]
    }]).then((data)=>{

        switch(data.result){
            case "View All Employees": viewEmployees(); break;
            case "View All Roles": viewRoles(); break;
            case "Exit": connection.end();break;
        }
    })
}

function viewEmployees(){
    let queryString = `select e.id,e.first_name,e.last_name,title,name,salary,
    CONCAT(m.first_name, " " , m.last_name) AS "manager"
    from employee e
    inner join role on e.role_id = role.id
    inner join department on role.department_id = department.id
    inner join employee m ON m.id = e.manager_id;`
    connection.query(queryString,(err,res)=>{
        formatEmployees(res)
    })
}
function viewRoles(){
    let queryString = `select role.id,title,name,salary
    from role
    inner join department on role.department_id = department.id;`
    connection.query(queryString,(err,res)=>{
        formatRoles(res)
    })
}
function formatEmployees(res){
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
    init()
}
function formatRoles(res){
    let table = new Table;
    res.forEach((role) =>{
        table.cell('id',role.id)
        table.cell('Title',role.title)
        table.cell('Department',role.name)
        table.cell('Salary',role.salary)
        table.newRow()
    })
    console.log(table.toString())
    init()
}
function formatDepartment(res){
    let table = new Table;
    res.forEach((department) =>{
        table.cell('id',department.id)
        table.cell('Department',department.name)
        table.newRow()
    })
    console.log(table.toString())
    init()
}