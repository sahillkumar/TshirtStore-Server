const Category = require("../models/category")

exports.getCategoryById = (req,res,next,id)=>{
    Category.findById(id,(err,category)=>{
        if(err || !category){
            return res.status(400).json({
                error:"Unable to get category"
            })
        }
        req.category = category
        next()
    })
}

exports.createCategory = (req,res)=>{
    const category = new Category(req.body)
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"Unable to create category"
            })
        }
        res.json(category)
    })
}

exports.getAllCategories = (req,res)=>{
    Category.find().exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                error:"Unable to get Categories"
            })
        }
        res.send(categories)
    })
}

exports.getCategory = (req,res)=>{
    res.send(req.category)
}

exports.updateCategory = (req,res)=>{

    const category = req.category
    category.name = req.body.name
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"Unable to update category"
            })
        }
        res.json(category)
    })

    //Alternate method

    /*
    Category.findOneAndUpdate(
        {_id:res.category._id},
        {$set:req.body},
        {new:true, useFindAndModify:false},
        (err,category)=>{
            if(err){
                return res.status(400).json({
                    error:"Unable to update category"
                })
            }
            res.send(category)
        })
    */
}


exports.deleteCategory = (req,res)=>{
    const category = req.category
    category.remove((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"Unable to delete category"
            })
        }
        res.json({
            msg:"deleted successfully"
        })
    })

    // Category.deleteOne(
    //     {_id:req.category.id},
    //     (err)=>{
    //     if(err){
    //         return res.status(400).json({
    //             error:"Unable to delete category"
    //         })
    //     }
    // }))
}