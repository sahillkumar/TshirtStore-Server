const { Order,ProductInCart } = require("../models/order")

exports.getOrderById = (req,res,next,id)=>{
    Order.findById(id)
    .populate("products.product","_id name price")
    .exec((err,order)=>{
        if(err || !order){
            return res.status(400).json({
                error:"unable to fetch product"
            })   
        }
        req.order = order
        next()
    })
}

exports.getOrder =(req,res)=>{
    res.send(req.order)
}

exports.createOrder = (req,res,next)=>{
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"Unable to Place Order"
            })
        }
        res.json(order)
        next()
    })
}

exports.getAllOrders = (req,res)=>{
    Order.find()
        .populate("user","_id name ")
        .exec((err,orders)=>{
            if(err || !orders){
                return res.status(400).json({
                    error:"unable to fetch orders"
                })   
            }
            res.json(orders)
        })

}

exports.updateOrderStatus =(req,res)=>{
    Order.update(
        {_id:req.order._id},
        {$set:{ status : req.body.status}},
        (err,order)=>{
            if(err){
                return res.status(400).json({
                    error:"Unable to update Order"
                })
            }
            res.json(order)
        })
}

exports.getOrderStatus = (req,res)=>{
    res.json(Order.schema.path("status").enumValue)
}