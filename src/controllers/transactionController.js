const db = require('../config/db');
const util = require('util');
const query = util.promisify(db.query).bind(db);

/*
    @desc checkout products
    @route POST /api/v1/transactions
    @access Public
*/

async function checkout(req, res) {
    const { total_price, paid_amount } = req.body;

    if(!total_price || !paid_amount) {
        return res.status(400).json({
            success: false,
            error: 'Missing credentials'
        })
    }
    res.json({
        message: await getOrderNumber()
    })
}

async function getOrderNumber(){
    const prefix = 'TRX';
    
    const [lastOrder] = await query("SELECT max(no_order) as id FROM transactions");

    if(lastOrder.id == null){
        return prefix + '0000001';
    }

    const no_order = parseInt(lastOrder.id.substring(3)) + 1;

    return prefix + no_order.toString().padStart(7, '0');
}

module.exports = {
    checkout
}