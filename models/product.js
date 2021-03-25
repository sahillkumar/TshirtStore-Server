const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        maxlength:50,
        trim:true,
        required:true,
        unique:true
    },
    price:{
        type:Number,
    },
    description:{
        type:String,
        maxlength:5000,
        trim:true,
        required:true
    },
    stock:{
        type:Number
    },
    sold:{
        type:Number,
        default:0
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    category:{
        type:ObjectId,
        ref:"Category",
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('Product',productSchema)