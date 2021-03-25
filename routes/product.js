const express = require("express")
const router = express.Router()
const  { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")
const  { getUserById } = require("../controllers/user")
const  { getProductById, createProduct, deleteProduct, getAllProducts, getProduct, updateProduct, photo, getDistinctCategories} = require("../controllers/product")


// params
router.param('userId',getUserById)
router.param('productId',getProductById)

//routes 
router.post('/product/create/:userId',isSignedIn,isAuthenticated,isAdmin,createProduct)
router.put('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,updateProduct)
router.delete('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteProduct)
router.get('/products',getAllProducts)
router.get('/products/categories',getDistinctCategories)
router.get('/product/:productId',getProduct)
router.get('/product/photo/:productId',photo)

module.exports = router