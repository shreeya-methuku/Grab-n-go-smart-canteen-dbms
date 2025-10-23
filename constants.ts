
export const SQL_SCHEMA = `
-- Grab 'n Go SQL Schema, Triggers, Procedures, and Functions

CREATE TABLE ADDRESS (
    address_id INT PRIMARY KEY,
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50)
);

CREATE TABLE STUDENT (
    student_id INT PRIMARY KEY,
    name VARCHAR(50),
    department VARCHAR(50),
    phone VARCHAR(15),
    dob DATE,
    age INT,
    address_id INT,
    FOREIGN KEY (address_id) REFERENCES ADDRESS(address_id)
);

CREATE TABLE STAFF_ADMIN (
    staff_id INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    phone VARCHAR(15)
);

CREATE TABLE DELIVERY_AGENT (
    delivery_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    middle_name VARCHAR(50),
    last_name VARCHAR(50),
    name VARCHAR(100),
    phone VARCHAR(15),
    status VARCHAR(20),
    shift_time VARCHAR(20)
);

CREATE TABLE MENU_ITEM (
    menu_item_id INT PRIMARY KEY,
    name VARCHAR(50),
    shift_menu VARCHAR(20),
    staff_id INT,
    stock INT DEFAULT 10,
    FOREIGN KEY (staff_id) REFERENCES STAFF_ADMIN(staff_id)
);

CREATE TABLE \`ORDER\` (
    order_id INT PRIMARY KEY,
    student_id INT,
    FOREIGN KEY (student_id) REFERENCES STUDENT(student_id)
);

CREATE TABLE ORDER_MENU_ITEM (
    order_id INT,
    menu_item_id INT,
    PRIMARY KEY (order_id, menu_item_id),
    FOREIGN KEY (order_id) REFERENCES \`ORDER\`(order_id),
    FOREIGN KEY (menu_item_id) REFERENCES MENU_ITEM(menu_item_id)
);

CREATE TABLE PAYMENT (
    payment_id INT PRIMARY KEY,
    order_id INT,
    amount DECIMAL(10,2),
    form_of_payment VARCHAR(20),
    name VARCHAR(50),
    payment_date DATE,
    FOREIGN KEY (order_id) REFERENCES \`ORDER\`(order_id)
);

CREATE TABLE FEEDBACK (
    feedback_id INT PRIMARY KEY,
    menu_item_id INT,
    student_id INT,
    response TEXT,
    staff_response TEXT,
    staff_response_date DATE,
    feedback_action VARCHAR(100),
    FOREIGN KEY (menu_item_id) REFERENCES MENU_ITEM(menu_item_id),
    FOREIGN KEY (student_id) REFERENCES STUDENT(student_id)
);

CREATE TABLE ASSIGN (
    staff_id INT,
    delivery_id INT,
    PRIMARY KEY (staff_id, delivery_id),
    FOREIGN KEY (staff_id) REFERENCES STAFF_ADMIN(staff_id),
    FOREIGN KEY (delivery_id) REFERENCES DELIVERY_AGENT(delivery_id)
);

CREATE TABLE STAFF_MONITOR (
    staff_id INT,
    menu_item_id INT,
    PRIMARY KEY (staff_id, menu_item_id),
    FOREIGN KEY (staff_id) REFERENCES STAFF_ADMIN(staff_id),
    FOREIGN KEY (menu_item_id) REFERENCES MENU_ITEM(menu_item_id)
);

-- Note: Procedures, Triggers, and Functions are part of the database logic but provided here for context.
`;