const db = require("../config/db");
const util = require('util');
const query = util.promisify(db.query).bind(db);

/*
    @desc   create new product
    @route  POST /api/v1/products
    @access Public
*/

async function create(req, res) {
    const { name, price, stock } = req.body;

    if (!name || !price || !stock) {
        res.json({
            success: false,
            error: "All fields are required",
        });
    }

    try {
        await query("INSERT INTO products(name, price, stock) VALUES(?, ?, ?)", [name, price, stock]);
        const [rows] = await query("SELECT LAST_INSERT_ID() as id");
        res.status(201).json({
            success: true,
            data: {
                id: rows.id,
                name,
                price,
                stock,
            },
            message: "Product created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/*
    @desc   get all products
    @route  GET /api/v1/products
    @access Public
*/
async function getAll(req, res) {
    try {
        const data = await query("SELECT * FROM products");
        res.status(200).json({
            success: true,
            data,
            message: "Products fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

module.exports = {
    create,
    getAll
};
