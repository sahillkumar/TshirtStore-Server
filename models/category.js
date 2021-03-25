const mongoose = require('mongoose')

const catergorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        maxlength:50
    }
},{timestamps:true})

module.exports = mongoose.model("Category",catergorySchema)