const express = require("express")
const router = express.Router()
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const { createCategory, getCategoryById,getAllCategories,getCategory,updateCategory,deleteCategory } = require("../controllers/category")

// params
router.param("userId",getUserById)
router.param("categoryId",getCategoryById)

// routes
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory)
router.get("/categories",getAllCategories)
router.get("/category/:categoryId",getCategory)
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory)
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteCategory)

module.exports = router 