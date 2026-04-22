const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.middleware");
const requireAdmin = require("../../middlewares/requireAdmin.middleware");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../../controllers/products/product.controller");

//controllers

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", auth, requireAdmin, createProduct);
router.put("/:id", auth, requireAdmin, updateProduct);
router.delete("/:id", auth, requireAdmin, deleteProduct);

module.exports = router;