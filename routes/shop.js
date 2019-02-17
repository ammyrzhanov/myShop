var express = require('express');
var router = express.Router();
const shopController=require('../controllers/shop');
/* GET home page. */
router.get('/',shopController.getShop );

router.get('/order',shopController.getOrders );

router.get('/cart',shopController.getCart);

router.post('/cart',shopController.postCart);

router.post('/cart-delete',shopController.postRemoveCart);

router.post('/create-order',shopController.postOrder);

module.exports = router;
