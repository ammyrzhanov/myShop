var express = require('express');
var router = express.Router();
const authController=require('../controllers/auth');
/* GET home page. */
router.get('/login', authController.getLogin);

router.get('/signup',authController.getSignup);

router.post('/signup',authController.postSignup);

router.post('/login',authController.postLogin);

router.post('/logout',authController.postLogout);


module.exports = router;
