const Order = require("../../models/orders/order.model");
const Cart = require("../../models/carts/cart.model");
const Product = require("../../models/products/product.model");

const createOrder = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];
    const successfulUpdates = [];

    // check stock and update atomically
    for (const item of cart.items) {
      const productId = item.product._id;
      const qty = item.quantity;

      const result = await Product.updateOne(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } }
      );

      if (result.modifiedCount === 0) {
        // rollback previous updates
        for (const prev of successfulUpdates) {
          await Product.updateOne(
            { _id: prev.productId },
            { $inc: { stock: prev.qty } }
          );
        }

        return res.status(400).json({
          message: `Product ${item.product.name} is out of stock`,
        });
      }

      successfulUpdates.push({ productId, qty });

      totalAmount += item.product.price * qty;

      orderItems.push({
        product: productId,
        quantity: qty,
        priceAtPurchase: item.product.price,
      });
    }

    //  create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      status: "pending",
    });

    // clear cart
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Checkout failed" });
  }
};

//Get user orders
const getOrders = async (req, res) => {
    try{
        const orders = await Order.find({ user: req.user._id})
        .populate("items.product")
        .sort({ createdAt: -1});

        res.json(orders);
    } catch (error){
        res.status(500).json({ message: "Error fetching orders"});
    }
};

//Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
};

//Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
};