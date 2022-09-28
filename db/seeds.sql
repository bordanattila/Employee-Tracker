INSERT INTO department (name)
VALUES ("Web Development"),
       ("Sales"),
       ("Human Resources"),
       ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Frontend", 20000, 1),
       ("Backend", 21000, 1),
       ("Payroll", 19000, 3),
       ("Training specialist", 18000, 3),
       ("Corporate sales", 20000, 2),
       ("Startup sales", 21000, 2),
       ("Traditional marketing", 19000, 4),
       ("Online marketing", 17000, 4);

INSERT INTO manager (first_name, last_name)
VALUES  ("Nick", "Fury"),
        ("Steve", "Rogers"),
        ("Carol", "Denverse");
        
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Jane", "Doe", 1, 3),
        ("John", "Doe", 2, 2),
        ("Bruce", "Banner", 5, 1),
        ("Peter", "Parker", 3, 1),
        ("Tony", "Stark", 4, 1);
