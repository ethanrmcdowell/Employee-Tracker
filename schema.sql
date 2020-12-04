DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;

USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department (name)
VALUES ("Engineering"), ("Finance"), ("Legal"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES
("Sales Lead", 80000, 4),
("Salesperson", 45000, 4),
("Lead Engineer", 112000, 1),
("Software Engineer", 72000, 1),
("Account Manager", 68000, 4),
("Accountant", 85000, 2),
("Legal Team Lead", 145000, 3);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES
("Rikesh", "Riddle", null, 1),
("Marcia", "Squires", null, 3),
("Meera", "Gilliam", null, 5),
("Arley", "Weiss", null, 6),
("Alicia", "Atkins", null, 7),
("Brady", "Abbott", 1, 2),
("Tobey", "Moody", 1, 2),
("Nel", "Allan", 1, 2),
("Simeon", "Atherton", 2, 4),
("Elen", "Harwood", 2, 4),
("Constance", "Yu", 2, 4),
("Zaina", "Poole", 3, 6),
("Dominique", "Huynh", 4, 6),
("Avery", "Rosa", 4, 6),
("Mylikka", "Milner", 3, 6),
("Momina", "Flynn", 4, 6),
("Daphne", "Bullock", null, 5),
("Amaan", "Carillo", 1, 2),
("Benjamin", "Carroll", 1, 2),
("Reede", "Preece", 4, 6);

SELECT * FROM employee_db.employee;
SELECT * FROM employee_db.role;
SELECT * FROM employee_db.department;