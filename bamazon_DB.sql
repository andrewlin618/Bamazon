DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;
USE bamazon_DB;
CREATE TABLE products (
    item_id INT AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price INT(10) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY (item_id)
);
INSERT INTO
    products (
        product_name,
        department_name,
        price,
        stock_quantity
    )
VALUES
    ("iphone11", "Electronic", 699, 30),
    ("iphone11pro", "Electronic", 999, 30),
    ("sushi combo", "Food", 50, 20),
    ("hot pot", "Food", 60, 10),
    ("basketball", "sports", 20, 30),
    ("baseball", "sports", 5, 200),
    ("github-tshirt", "clothes", 20, 1000),
    ("ironman-suit", "clothes", 2000000, 3),
    ("manatee", "pet", 20000, 5),
    ("Mew", "pokemon", 200000000, 1) -- ### Alternative way to insert more than one row
    -- INSERT INTO products (flavor, price, quantity)
    -- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);