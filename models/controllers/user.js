const User = require("../models/user")
const Order = require("../models/order")


exports.getUserById = (req,res,next,id)=>{
    User.findById(id,(err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"Bad Request or no user Found"
            })
        }
        req.profile = user
        next()
    })
 
}

exports.getUser = (req,res)=>{
    req.profile.salt = undefined
    req.profile.encryPassword = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    res.send(req.profile)
}

exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true , useFindAndModify:false},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:"not able to update the user"
                })
            }
            user.salt = undefined
            user.encryPassword = undefined
            res.send(user)
        }
    )
}

exports.userPurchaseList = (req, res) => {
    Order.find({user:req.profile._id})
         .populate("user","_id name")
         .exec((err,order)=>{
             if(err || !order){
                 return res.status(400).json({
                     error :"No orders for this user !"
                 })
             }
             res.json(order)
         })
}

exports.pushOrderInPurchaseList = (req,res,next)=>{
    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    });

    //saving the purchaseList in database
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true , useFindAndModify:false},
        (err,purchases)=>{
            if(err){
                return res.status(400).json({
                    error :"unable to save purchase List"
                })
            }
            next()
        }
    ) 
}