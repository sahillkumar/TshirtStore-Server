const mongoose = require("mongoose")
const crypto = require('crypto')
const { v1: uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:30
    },
    lastname:{
        type:String,
        maxlength:30,
        trim:true
    },
    userinfo:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        maxlength:30,
        trim:true,
        required:true,
        unique:true
    },
    encryPassword:{
        type:String,
        required:true
    },
    salt:{
        type:String
    },
    purchases:{
        type:Array,
        default:[]
    },
    roles:{
        type:Number,
        default:0
    }
},{timestamps:true})

userSchema.virtual("password")
    .set(function(password) {
        this._password=password
        this.salt = uuidv1()
        this.encryPassword=this.securePassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.methods ={
    authenticate:function (plainpassword) {
        return this.encryPassword === this.securePassword(plainpassword)
    },
    securePassword:function (plainpassword) {
            if(!plainpassword)
                return ""
            try {
                return crypto.createHmac('sha512',this.salt)
                             .update(plainpassword)
                             .digest('hex')
            } catch (error) {
                return ""
            }
        }
    }

module.exports= mongoose.model("User",userSchema)
