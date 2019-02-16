var express = require('express');
var router = express.Router();
const shopController=require('../controllers/shop');
/* GET home page. */
router.get('/',shopController.getShop );

router.post('/cart',shopController.postCart);


router.get('/order',shopController.getOrder);
module.exports = router;
