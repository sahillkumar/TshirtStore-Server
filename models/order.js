const mongoose = require ("mongoose")
const {ObjectId} = mongoose.Schema

const productInCartSchema = new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:String,
    quantity:Number,
    price:Number,
},{timestamps:true})

const orderSchema = new mongoose.Schema({
    products:[productInCartSchema],
    address:String,
    transaction_id:{},
    amount:Number,
    status:{
        type:String,
        default:"Recieved",
        enum:["Recieved","Processing","Confirmed","Shipped","Delivered","Cancelled"]
    },
    updated:Date,
    user:{
        type:ObjectId,
        ref:"User"
    }

},{timestamps:true})

const Order = mongoose.model("Order",orderSchema)
const ProductInCart = mongoose.model("ProductInCart",productInCartSchema)

module.exports = {Order,ProductInCart}