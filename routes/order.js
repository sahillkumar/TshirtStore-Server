const express = require("express")
const { getOrderById, createOrder, getAllOrders, getOrder, updateOrderStatus, getOrderStatus } = require("../controllers/order")
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user")
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")
const { updateStock } = require("../controllers/product")
const router = express.Router()

// params
router.param('orderId',getOrderById)
router.param('userId',getUserById)

//routes
router.post("/order/create/:userId",isSignedIn,isAuthenticated,createOrder,pushOrderInPurchaseList,updateStock)
router.get("/orders/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)
router.get("/orders/:orderId",isSignedIn,isAuthenticated,getOrder)
router.put("/orders/:orderId/:userId",isSignedIn,isAuthenticated,isAdmin,updateOrderStatus)
router.get("/orders/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)

module.exports = router