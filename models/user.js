const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cart:{
        items:[{
            productId:{
                type:Schema.Types.ObjectId,
                ref:'Product',
            },
            title:{
                type:String
            },
            quantity:{
                type:Number,
            }
        }]
    }
});
UserSchema.methods.addToCart=(product)=>{
    const cartProductIndex=this.cart.items.findIndex(i=>{
        return i.productId.toString()===product._id.toString();
    });
    let newQuantity=1;
    const updateCartItems=[...this.cart.items];

    if(cartProductIndex>=0){
        newQuantity=this.cart.items[cartProductIndex].quantity+1;
        updateCartItems[cartProductIndex].quantity=newQuantity;
    }else{
        updateCartItems.push({
            productId:product._id,
            quantity:newQuantity
        });
    }
    const updateCart={
        items: updateCartItems
    };
    this.cart=updateCart;
    return this.save();
};

UserSchema.method.removeFromCart=(productId)=>{
    const updateCartItems=this.cart.items.filter(item=>{
        return item.productId.toString()!==productId.toString();
    });

    this.cart.items=updateCartItems;

    return this.save();
};

UserSchema.methods.clearCart=function(){
    this.cart={items:[]};
    return this.save();
};
module.exports=mongoose.model('User',UserSchema);