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
("Sam","Dratch",5,null),
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
