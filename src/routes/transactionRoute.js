const router = require('express').Router();
const transactionController = require('../controllers/transactionController');

router.post('/', transactionController.checkout);

module.exports = router;