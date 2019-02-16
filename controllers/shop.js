const Product = require('../models/product');
const User = require('../models/user');
exports.getShop = (req, res, next) => {
    Product
        .find()
        .then(product => {
            res.render('shop', {
                products: product,
                isAuthentificated: req.session.isLoggedIn,
                isAuthentificatedAdmin: req.session.isLoggedInAdmin
            });

        })
        .catch(err => {
            console.log(err);
        });
};
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    //console.log(productId);
    Product
        .findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/order');
        })
        .catch(err => {
            console.log(err);
        });

};
exports.postRemoveCart = (req, res, next) => {
    const productId = req.body.productId;
    req.user.removeFromCart()
        .then(result => {
            res.redirect('/')
        })
        .catch(err => console.log(err));
}

exports.getOrder = (req, res, next) => {
    Product
        .find()
        .then(product => {
            res.render('order', {
                products: product,
                isAuthentificated: req.session.isLoggedin,
                isAuthentificatedAdmin: req.session.isLoggedinAdmin

            });
        })
        .catch(err => {
            console.log(err);
        });
};