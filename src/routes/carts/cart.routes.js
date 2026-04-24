const express = require("express");
const router = express.Router();

const {
    getCart,
    addToCart,
    updateCartItem,
    clearCart,
} = require("../../controllers/carts/cart.controllers");

const auth = require("../../middlewares/auth.middleware");

router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.put("/items/:productId", auth, updateCartItem);
router.delete("/clear", auth, clearCart);

module.exports = router;