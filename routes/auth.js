const express = require('express')
const router = express.Router()
const User = require("../models/user")
const { signout,signup,signin,isSignedIn } = require('../controllers/auth')
const { check } = require("express-validator")

router.post("/signup",
[
    check('name').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
    check('email').isEmail()
                  .withMessage('Not a valid email')
                  .custom((value) => {
                      return new Promise((resolve, reject) => {
                      User.findOne({email:value}, function(err, user){
                        if(err) {
                          reject(new Error('Server Error'))
                        }
                        if(Boolean(user)) {
                          reject(new Error('E-mail already in use'))
                        }
                        resolve(true)
                      });
                    });
                }),
    check('password').isLength({ min: 5 }).withMessage('password must be at least 5 chars long').matches(/\d/).withMessage('must contain a number')

],signup)

router.post("/signin",
[
  check("email").isEmail(),
  check("password").isLength({min:2}).withMessage('password must be atleast 2 char long')
],
signin)

router.get("/signout",signout)

router.get("/testroute",isSignedIn,(req,res)=>{
  res.send("this is a protected route")
  
})

module.exports = router
