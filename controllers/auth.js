const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res, next) => {
    res.render('login', {
        isAuthentificated: req.session.isLoggedIn,
        isAuthentificatedAdmin: req.session.isLoggedInAdmin,
        error:req.session.error
    });

};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log('не нашел ' + email);
    if (email === 'admin@admin') {
        User.find({
                email: 'admin@admin'
            })
            .then(user => {
                if (!user) {
                    req.session.error= true;
                    return res.redirect('/login');

                }
                console.log(user[0]);
                bcrypt.compare(password, user[0].password)
                    .then(doMatch => {
                        if (doMatch) {
                            req.session.isLoggedInAdmin = true;
                            req.session.user = user;
                            console.log(req.session.isLoggedInAdmin);
                            return req.session.save(err => {
                                console.log(err);
                                res.redirect('/admin');
                            })
                        }
                        res.redirect('/login');
                    })
                    .catch(err => console.log(err));

            })
            .catch();
    } else {
        User.findOne({
                email: email
            })
            .then(user => {
                if (!user) {
                    req.session.error= true;
                    return res.redirect('/login');
                }
                bcrypt.compare(password, user.password)
                    .then(doMatch => {
                        if (doMatch) {
                            console.log(user);
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            console.log(req.session.isLoggedIn);
                            return req.session.save(err => {
                                console.log(err);
                                res.redirect('/');
                            })
                        }
                        res.redirect('/login');
                    })
                    .catch(err => console.log(err));

            })
            .catch(err => console.log(err));
    };
};
exports.getSignup = (req, res, next) => {
    res.render('signup', {
        isAuthentificated: false,
        isAuthentificatedAdmin: false,
        errorSigup:req.session.errorSignup
    });

};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
            email: email
        })
        .then(userDoc => {
            if (userDoc) {
                req.session.errorSignup= true;
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 10)
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        cart: {
                            items: []
                        }
                    });
                    return user.save().then(result => {
                        console.log(result);
                        res.redirect('/login');
                    }).catch(err => console.log(err));
                })


        })
        .catch(err => console.log(err));

};


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}