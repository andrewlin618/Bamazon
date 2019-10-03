var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("=============================================")
        console.log("   Welcome to Bamazon.com manager system! ");
        console.log("=============================================")
        askManager(res);
    });
});

function askManager(res) {
    inquirer.prompt({
        name: "operator",
        type: "list",
        message: "What do you want to do?",
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }).then(function (answer) {
        switch (answer.operator) {
            case 'View Products for Sale':
                viewProductsForSale();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory(res);
                break;
            case 'Add New Product':
                addNewProduct();
                break;
        }
    });

}


function viewProductsForSale() {
    console.log("  ====================================================================================")
    console.log("//                             Welcome to Bamazon.com                               //")
    console.log("====================================================================================")
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        askManager();
    });
}

function viewLowInventory() {
    console.log("  ====================================================================================")
    console.log("//                        Low Inventory of Bamazon.com                              //")
    console.log("====================================================================================")
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        console.table(res);
        askManager();
    });

}

function addToInventory(result) {
    inquirer.prompt({
        name: "id",
        message: "What do you want to add to inventory (item_id)?",
    }).then(function (answer) {
        var check = answer.id > 0 && answer.id <= 11;
        if (check) {
            var productID = answer.id;
            var productPicked = result[answer.id - 1].product_name;
            var productCount = result[answer.id - 1].stock_quantity;
            console.log("==============================================")
            console.log(`You want to add more ${productPicked} into inventory.`);
            console.log(`We have ${productCount} ${productPicked}s in stock.\n`);

            // Ask for amount：
            inquirer.prompt({
                name: "amount",
                message: `How many ${productPicked}s do you want to add?`,
            }).then(function (answer) {
                var number = parseInt(answer.amount) + productCount;
                console.log("==============================================")
                console.log(`Successfully add ${answer.amount} ${productPicked} to inventory.\n`)
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{
                            stock_quantity: number
                        },
                        {
                            item_id: productID
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                    }
                );
                askManager(result);
            });
        } else {
            console.log("ID undefined......");
            askManager(result);
        }
    });
}

function addNewProduct() {
    inquirer.prompt([{
            name: "product",
            message: "What do you want to add to store?",
        },
        {
            name: "department",
            message: "Which department should this product belong to?",
        },
        {
            name: "price",
            message: "What is the price of the product?",
        },
        {
            name: "quantity",
            message: "How many do you want?"
        }
    ]).then(function (answer) {
        connection.query(
            "INSERT INTO products SET ?", {
                product_name: answer.product,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            },
            function (err, res) {
                if (err) throw err;
                askManager();
            });
    });
}