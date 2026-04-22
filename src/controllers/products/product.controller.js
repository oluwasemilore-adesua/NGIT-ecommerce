const User = require("../../models/users/user.model");
const Product = require("../../models/products/product.model");


// Create Product
const createProduct = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const userExist = await User.findById(userId);

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (userExist.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can create products"
      });
    }

    const { name, description, price, category, stock, imageUrl } = req.body;

    if (!name || !description || !price || !category || !stock || !imageUrl) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json(savedProduct);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating product"
    });
  }
};


// Get all products
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json(products);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching products"
    });
  }
};


//  Get Single Product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message
    });
  }
};


//  Update Product
const updateProduct = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({
      message: "Product ID is required"
    });
  }

  try {
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can update products"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const { name, description, price, category, stock, imageUrl } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        category,
        stock,
        imageUrl
      },
      { new: true }
    );

    return res.status(200).json(updatedProduct);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating product"
    });
  }
};


// 
const deleteProduct = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({
      message: "Product ID is required"
    });
  }

  try {
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can delete products"
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting product"
    });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};