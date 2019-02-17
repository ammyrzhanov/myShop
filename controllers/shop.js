const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

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
    Product
        .findById(productId)
        .then(product => {
            const cartProductIndex = req.user.cart.items.findIndex(i => {
                return i.productId.toString() === product._id.toString();
            });
            let newQuantity = 1;
            let newTitle=product.title;
            const updateCartItems = [...req.user.cart.items];

            if (cartProductIndex >= 0) {
                newQuantity = req.user.cart.items[cartProductIndex].quantity + 1;
                updateCartItems[cartProductIndex].quantity = newQuantity;
            } else {
                updateCartItems.push({
                    productId: product._id,
                    title:newTitle,
                    quantity: newQuantity
                });
            }
            const updateCart = {
                items: updateCartItems
            };
            req.user.cart = updateCart;
            return req.user.save();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });

};
exports.postRemoveCart = (req, res, next) => {
    const productId = req.body.productId;
    Product
        .findById(productId)
        .then(product => {
            const updateCartItems = req.user.cart.items.filter(item => {
                return item.productId.toString() !== productId.toString();
            });

            req.user.cart.items = updateCartItems;

            return req.user.save();
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products =req.user.cart.items;
            res.render('cart', {
                products: products,
                isAuthentificated: req.session.isLoggedIn,
                isAuthentificatedAdmin: req.session.isLoggedInAdmin
            });
        })
        .catch(err => console.log(err));

};

exports.postOrder = (req, res, next) => {
    req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        const products = user.cart.items.map(i => {
          return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
        const order = new Order({
          user: {
            email: req.user.email,
            userId: req.user
          },
          products: products
        });
        return order.save();
      })
      .then(result => {
        return req.user.clearCart();
      })
      .then(() => {
        res.redirect('/');
      })
      .catch(err => console.log(err));
  };
  
  exports.getOrders = (req, res, next) => {
    Order.find()
      .then(orders => {
        res.render('order', {
            isAuthentificated:false,
            isAuthentificatedAdmin: req.session.isLoggedInAdmin,
            orders: orders
        });
      })
      .catch(err => console.log(err));

  };