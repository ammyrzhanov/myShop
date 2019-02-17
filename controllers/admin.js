const Product=require('../models/product');
exports.getAdmin=(req,res,next)=>{
    Product.find()
    .then(product=>{
        if(!req.session.isLoggedInAdmin){
            return res.redirect('/login');
        }
        res.render('admin',{
            products:product,
            isAuthentificated:req.session.isLoggedIn,
            isAuthentificatedAdmin:req.session.isLoggedInAdmin
        });
    console.log(req.session.isLoggedInAdmin);

    })
    .catch(err=>console.log(err));
}
exports.postAddProduct=(req,res,next)=>{
    const title=req.body.title;
    const price=req.body.price;
    const imageUrl=req.body.imageUrl;
    const description=req.body.description;

    const product=new Product({
        title:title,
        price:price,
        imageUrl:imageUrl,
        description:description,
    });
    product
    .save()
    .then(result=>{
        console.log(result);
        res.redirect('admin');
    })
    .catch(err=>console.log(err));
};

exports.postDelete=(req,res,next)=>{
    const productId=req.body.productId;
    Product
        .findByIdAndRemove(productId)
        .then(result=>{
            res.redirect('/admin');
        })
        .catch(err=>console.log(err));
}