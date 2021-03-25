const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.createProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req,(err,fields,file)=>{

        if(err){
            return res.status(400).json({
                error:"error in image"
            })
        }

        const { name , price , description, category, stock}= fields
        if(!name || !price || !category || !description || !stock){
            return res.status(400).json({
                error:"enter all fields"
            })
        }

        const product = new Product(fields)
    
        // handling the file

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"Image size is too Big !"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

       

        // saving in database

        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"unable to create product"
                })
            }
            res.json(product)
        })
    })
   
}

exports.getProductById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err || !product){
            return res.status(400).json({
                error:"unable to fetch product"
            })   
        }
        req.product = product
        next()
    })
}

exports.getProduct = (req,res)=>{
    const product = req.product
    product.photo = undefined
    res.json(product)
}

exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.getProductByCategory=(req,res)=>{
    Product.find({category:req.category._id})
            .exec((err,products)=>{
                if(err || !products){
                    return res.status(400).json({
                        error :"No products in this category !"
                    })
                }
                res.json(products)
            })
}

exports.getAllProducts =(req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy,"asc"]])
        .limit(limit)
        .exec((err,products)=>{
            if(err){
                return res.status(400).json({
                    error:"Unable to fetch all products "
                })
            }
            res.send(products)
        })
}

exports.updateProduct = (req, res)=>{

    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req,(err,fields,file)=>{

        if(err){
            return res.status(400).json({
                error:"error in image"
            })
        }

        //updating Product
        var product = req.product
        product = _.extend(product,fields)

        // handling the file

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"Image size is too Big !"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
            
        }
        


        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"unable to create product"
                })
            }
            res.json(product)
        })
    }) 
}

exports.deleteProduct = (req,res)=>{
    const product = req.product
    product.remove((err)=>{
        if(err){
            return res.status(400).json({
                error:"Unable to delete product"
            })
        }
        res.json({
            msg:" product deleted successfully"
        })
    })
}

exports.updateStock = (req,res,next)=>{
    let operations = req.body.order.products.map(product=>{
        return {
            updateOne:{
                filter:{ _id : product._id },
                update: { stock : -product.count, sold : +product.count}
            }
        }
    })
    

    Product.bulkWrite(operations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error:"bulk operation error"
            })
        }
        next()
    })

}

exports.getDistinctCategories = (req,res)=>{
    Product.distinct("category",{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error:"fetching all categories failed !!"
            })
        }
        res.json(products)
    })
}