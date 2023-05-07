const db = require("../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);
const beginTransaction = util.promisify(db.beginTransaction).bind(db);
const commit = util.promisify(db.commit).bind(db);
const rollback = util.promisify(db.rollback).bind(db);
const { getOrderNumber, formatTransactions, updateStockProduct } = require("../helpers/utils");
const { success, ValidateError } = require("../helpers/response");

/*
    @desc checkout products
    @route POST /api/v1/transactions
    @access Public
*/

async function checkout(req, res, next) {
    const { total_price, paid_amount, products } = req.body;

    try {
        // validating
        if (!total_price || !paid_amount || !products) {
            throw new ValidateError("Missing credentials");
        }

        // checking stocks for updates
        const stockId = products.map((item) => item.id);
        if (new Set(stockId).size !== products.length) {
            throw new ValidateError("There are duplicate in product !");
        }
        await beginTransaction();

        await updateStockProduct(products, stockId);

        const number = await getOrderNumber();
        // creating transaction
        await query(
            "INSERT INTO transactions(no_order, total_price, paid_amount) values (?, ?, ?)",
            [number, total_price, paid_amount]
        );

        // creating transaction detail
        const values = products.map((item) => [
            number,
            item.id,
            item.qty,
            item.price,
        ]);
        await query(
            "INSERT INTO transactions_detail(no_order, product_id, qty, price) VALUES ?",
            [values]
        );
        res.status(201).json({
            success: true,
            data: {
                no_order: number,
            },
        });
        await commit();
    } catch (error) {
        await rollback();
        next(error);
    }
}

/*
    @desc   get all transactions
    @route  GET /api/v1/transactions
    @access public
*/
async function getTransactions(req, res, next) {
    try {
        const transactions = await query(
            "select * from transactions t inner join transactions_detail td on t.no_order = td.no_order inner join products p on td.product_id = p.id order by t.no_order;"
        );

        
        return success(res, formatTransactions(transactions), "Transaction fetched successfully");
    } catch (error) {
        next(error);
    }
}

module.exports = {
    checkout,
    getTransactions,
};
