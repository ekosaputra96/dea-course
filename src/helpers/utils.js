const db = require("../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);
const { ValidateError } = require("./response");

async function getOrderNumber() {
    const date = new Date();
    const prefix =
        "TR" +
        date.getFullYear().toString().slice(2) +
        (date.getMonth() + 1).toString().padStart(2, "0");

    const [lastOrder] = await query(
        "SELECT max(no_order) as id FROM transactions"
    );

    if (lastOrder.id == null) {
        return prefix + "0001";
    }

    const no_order = parseInt(lastOrder.id.substring(6)) + 1;

    return prefix + no_order.toString().padStart(4, "0");
}

function formatTransactions(transactions) {
    let transaction = [],
        detailTransaction = [],
        currentNoOrder = "";
    transactions.forEach((item) => {
        if (currentNoOrder !== item.no_order) {
            // add transaction with unique no_order
            transaction.push({
                no_order: item.no_order,
                total_price: item.total_price,
                paid_amount: item.paid_amount,
                detailTransaction,
            });

            // next no_order
            currentNoOrder = item.no_order;
            detailTransaction = [];
        }

        // add each detail transaction according to the no_order
        transaction[transaction.length - 1].detailTransaction.push({
            no_order: item.no_order,
            name: item.name,
            qty: item.qty,
            price: item.price,
        });
    });

    return transaction;
}

async function updateStockProduct(products, stockId) {
    const stock = await query(
        "SELECT id, name, stock FROM products WHERE id IN (?) FOR UPDATE",
        [stockId]
    );

    const updateStock = products.map((item) => {
        const product = stock.find((el) => el.id === item.id);
        if (!product) {
            throw new ValidateError(
                `Product with id : ${item.id} is not found`
            );
        }

        const currentStock = product.stock - item.qty;
        if (currentStock < 0) {
            throw new ValidateError(`${product.name} has no enough stock !`);
        }

        return [item.id, currentStock];
    });

    // updating stock
    await query(
        "INSERT INTO products(id, stock) values ? ON DUPLICATE KEY UPDATE stock = VALUES(stock)",
        [updateStock]
    );
}

module.exports = {
    getOrderNumber,
    formatTransactions,
    updateStockProduct,
};
