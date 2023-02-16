INSERT INTO department (department_name)
VALUES  ("Sales"),
        ("Finance"),
        ("Legal"),
        ("Technology");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Representative", 60000, 1),
        ("Accountant", 70000, 2),
        ("Lawyer", 80000, 3),
        ("Engineer", 90000, 4);
       
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Fred", "Rogers", 1, NULL),
        ("Ginger", "Sanders", 2, 1),
        ("Cheryl", "Nelson", 3, NULL),
        ("Joe", "Powell", 4, 3);
