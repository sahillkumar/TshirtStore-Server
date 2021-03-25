const User = require("../models/user")
const { validationResult, check } = require("express-validator")
const jwt = require("jsonwebtoken")
const exjwt = require("express-jwt")

//Sign up

exports.signup= (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(422).json({
            error:errors.array()[0].msg,
            param:errors.array()[0].param
        })
    }
    const user = new User(req.body)
    user.save((error,user)=>{
        if(error)
        {
            return res.status(400).json({
                error:"user unable to save data in db aka Bad Request"
            })
        }
        res.json({
            name:user.name,
            lastname:user.lastname,
            email:user.email,
            id:user._id
        })
    })
}

//Sign In

exports.signin = (req,res)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status('422').json({
            error:errors.array()[0].msg,
            param:errors.array()[0].param
        })
    }

    const {email, password} = req.body
    User.findOne({email},(err,user)=>{
        if(err){
            return res.status(401).json({
                error:"server Error"
            })
        }
        
        if(!user){
            return res.status(401).json({
                error:"Please Signup First !"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Invalid Password"
            })
        }

        // creating token
        const token = jwt.sign({_id:user._id},process.env.SECRET)

        // putting token in cookie
        res.cookie("token",token,{expire:new Date() + 8982})

        // response to front end
        const {name,email,_id,roles} = user
        return res.json({token:token,user:{email,_id,name,roles}})
    })
}

// Sign out

exports.signout = (req,res)=>{
    
    // clearing cookie
    res.clearCookie("token")
    res.send("signed out")
}

//protected routes
 
exports.isSignedIn = exjwt({                                        //authorization
        secret:process.env.SECRET,
        userProperty:"auth",
        algorithms: ['HS256']
    })

// custom middleware

exports.isAuthenticated = (req,res,next)=>{
    let checker = req.profile && req.auth && req.profile._id==req.auth._id
    if(!checker){
        return res.status(403).json({
            error:"Access Denied"
        })
    }
    next()
}

exports.isAdmin = (req,res,next)=>{
    if(req.profile.roles===0){
        return res.status(403).json({
            error:"Not Admin"
        })
    }
    next()
}