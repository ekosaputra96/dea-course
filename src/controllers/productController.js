const db = require("../config/db");
const util = require('util');
const query = util.promisify(db.query).bind(db);
const {success, ValidateError} = require("../helpers/response")

/*
    @desc   create new product
    @route  POST /api/v1/products
    @access Public
*/

async function create(req, res, next) {
    const { name, price, stock } = req.body;
    
    try {
        // validating
        if (!name || !price || !stock) {
            throw new ValidateError("All fields are required", 400);
        }

        // inserting new product
        const product = await query("INSERT INTO products(name, price, stock) VALUES(?, ?, ?)", [name, price, stock]);
        const [data] = await query("SELECT * FROM products WHERE id = ?", [product.insertId]);
        return success(res, data, "Product created successfully", 201)
    } catch (error) {
        next(error);
    }
}

/*
    @desc   get all products
    @route  GET /api/v1/products
    @access Public
*/
async function getAll(req, res, next) {
    try {
        const data = await query("SELECT * FROM products");
        return success(res, data, "Products fetched successfully")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    create,
    getAll
};
