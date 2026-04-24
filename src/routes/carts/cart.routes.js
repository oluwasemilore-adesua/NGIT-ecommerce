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
router.post("/add", auth, addToCart);
router.put("/update", auth, updateCartItem);
router.delete("/clear", auth, clearCart);

module.exports = router;