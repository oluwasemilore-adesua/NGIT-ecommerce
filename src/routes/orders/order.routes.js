const express = require("express");
const router = express.Router();

const{
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
} = require("../../controllers/orders/order.controller");

const auth = require("../../middlewares/auth.middleware");
const requireAdmin = require("../../middlewares/requireAdmin.middleware");

//checkout(create order)
router.post("/", auth, createOrder);

//Get all orders(current user)
router.get("/", auth, getOrders);

//Get single order
router.get("/:id", auth, getOrderById);

//Admin update order status
router.patch("/:id/status", auth, requireAdmin, updateOrderStatus);

module.exports = router;
