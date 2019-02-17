const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const cartShema=new Schema({
    productId:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports=mongoose.model('Cart',cartShema);