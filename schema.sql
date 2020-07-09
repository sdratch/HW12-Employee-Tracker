DROP database if exists employee_db;
CREATE DATABASE employee_db;
USE employee_db;
-- Create the table actors.
CREATE TABLE department (
  id int AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);
CREATE TABLE role (
  id int AUTO_INCREMENT,
  title varchar(30) NOT NULL,
  salary DECIMAL(8,2) NOT NULL,
  department_id INT,
  foreign KEY(department_id) references department(id),
  PRIMARY KEY(id)
);
CREATE TABLE employee (
  id int AUTO_INCREMENT,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id INT,
  manager_id INT,
  foreign KEY(manager_id) references employee(id),
  foreign KEY(role_id) references role(id),
  PRIMARY KEY(id)
);



insert into department(name)
VALUES ("Sales"),("Engineering"),("Finance"),("Legal");


insert into role(title,salary,department_id)
VALUES("Sales Lead",100000,1),("Salesperson",80000,1),
("Lead Engineer",150000,2),("Software Engineer",120000,2),
("Account Manager",150000,3),("Accountant",125000,3),
("Legal Team Lead",250000,4),("Lawyer",190000,4);

insert into employee(first_name,last_name,role_id,manager_id)
VALUES("John","Doe",1,null),
("Mike","Chan",2,null),
("Ashley","Rodriguez",3,null),("Kevin","Tupik",4,null),
("Sam","Rosenfield",5,null),
("Malia","Brown",6,null),("Sarah","Lourd",7,null),
("Tom","Allen",8,null),("Christian","Eckenrode",3,null);


UPDATE employee
SET manager_id = 3
WHERE id = 1;
UPDATE employee
SET manager_id = 1
WHERE id = 2;
UPDATE employee
SET manager_id = 3
WHERE id = 4;
UPDATE employee
SET manager_id = 7
WHERE id = 8;
UPDATE employee
SET manager_id = 2
WHERE id = 9;

select * from department;
select * from role;
select * from employee;
-- VALUES("John","Doe",1,3);
-- ("Mike","Chan",2,1),
-- ("Ashley","Rodriguez",3,null),("Kevin","Tupik",4,3),
-- ("Sam","Rosenfield",5,null),
-- ("Malia","Brown",6,null),("Sarah","Lourd",7,null),
-- ("Tom","Allen",8,7),("Christian","Eckenrode",3,2);