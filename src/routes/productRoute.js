const router = require('express').Router();
const productController = require('../controllers/productController')

router.get('/', productController.getAll)
router.post('/', productController.create);

module.exports = router;