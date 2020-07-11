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
