var express = require('express');
var router = express.Router();
const adminController=require('../controllers/admin');
/* GET home page. */
router.get('/admin',adminController.getAdmin);

router.post('/add',adminController.postAddProduct);

router.post('/delete',adminController.postDelete);

module.exports = router;
