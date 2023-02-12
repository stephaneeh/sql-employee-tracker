INSERT INTO department (id, name)
VALUES  ("Customer Services"),
        ("Finance"),
        ("Legal"),
        ("Technology"),

INSERT INTO role (title, salary, department_id)
VALUES  ("Representative", 60000, 1),
        ("Accountant", 70000, 2),
        ("Lawyer", 80000, 3),
        ("Engineer", 90000, 4),
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Fred", "Rogers", 01, 1234),
