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
    console.log("connected as id " + connection.threadId);
    console.log("  ====================================================================================")
    console.log("//                             Welcome to Bamazon.com                               //")
    console.log("====================================================================================")
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        askUser(res);
        // connection.end();
    });
});

function askUser(result) {

    // Ask for product ID;
    inquirer.prompt({
        name: "id",
        message: "What do you want to buy (item-id)?",
    }).then(function (answer) {

        // Check the validation of ID;
        var check = answer.id > 0 && answer.id <= 10;
        if (check) {
            var productID = answer.id;
            var productPicked = result[answer.id - 1].product_name;
            var productCount = result[answer.id - 1].stock_quantity;
            var productPrice = result[answer.id - 1].price;
            console.log("==============================================")
            console.log(`You want to buy ${productPicked}.`);
            console.log(`We have ${productCount} ${productPicked}s in stock.\n`);

            // Ask for amount;
            inquirer.prompt({
                name: "amount",
                message: `How many ${productPicked}s do you want?`,
            }).then(function (answer) {

                // Check the stock;
                if (answer.amount > productCount) {
                    console.log("==============================================");
                    console.log("Insufficient quantity!");
                    console.log(`We don't have enough ${productPicked}s now.....\n`);
                    askUser(result);
                } else {
                    console.log("==============================================");
                    console.log("Congratulations!");
                    if (answer.amount === 1) {
                        console.log(`You successfully bought ${answer.amount} ${productPicked}!`);
                    } else {
                        console.log(`You successfully bought ${answer.amount} ${productPicked}s!`);
                    }
                    console.log(`Total: $${answer.amount * productPrice}`)
                    if (productCount === answer.amount) {
                        console.log(`Now no more ${productPicked} in stock.\n`);
                    } else if (productCount == answer.amount + 1) {
                        console.log(`Now only ${productCount-answer.amount} ${productPicked} in stock.\n`);
                    } else {
                        console.log(`Now only ${productCount-answer.amount} ${productPicked}s in stock.\n`);
                    }
                    var number = productCount - answer.amount;
                    console.log(number);

                    // Update stock;
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
                    console.log("  ====================================================================================");
                    console.log("//                                    Bamazon.com                                   //");
                    console.log("====================================================================================");
                    connection.query("SELECT * FROM products", function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        askUser(res);
                    });
                }
            })
        } else {
            console.log("ID undefined......");
            askUser(result);
        }
    })
}