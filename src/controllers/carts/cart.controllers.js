const Cart = require("../../models/carts/cart.model");
const Product = require("../../models/products/product.model");

//Get Cart

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id})
        .populate("items.product");

        return res.status(200).json(cart || {items: []});
    } catch (error){
        return res.status(500).json({ message: "Error fetching cart"});
    }
};

//Add to Cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId.toString()
            );

            if (itemIndex >= 0) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error adding to cart" });
    }
};
//Update Cart Item 
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId }= req.params;

        let cart = await Cart.findOne({ user: req.user._id});

        if (!cart){
            return res.status(404).json({ message: "Cart not found"});
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString()=== productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not in cart"});
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();

        return res.status(200).json(cart);

    } catch (error) {
        return res.status(500).json({ message: "Error updating cart item" });
    }
};

//Clear Cart
const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({user: req.user._id});

        return res.status(200).json({
             message: "Cart cleared"
            });
    } catch (error) {
        return res.status(500).json({ message: "Error clearing cart" });
    }   
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    clearCart,
};