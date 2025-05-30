// Backend/controllers/productController.js
const Product = require('../Models/Product'); // Adjust path if necessary

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    console.log('Fetching products from MongoDB via controller...'); // For verification
    const productsFromDB = await Product.find({}); // Fetches all documents
    res.json(productsFromDB);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not fetch products');
  }
};

// @desc    Fetch single product by its id_from_js
// @route   GET /api/products/:id
// @access  Public
const getProductByIdFromJS = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        return res.status(400).json({ msg: 'Invalid product ID format' });
    }
    console.log(`Fetching product with id_from_js: ${productId} from MongoDB via controller...`);

    const productFromDB = await Product.findOne({ id_from_js: productId });

    if (!productFromDB) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(productFromDB);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not fetch product');
  }
};

// @desc    Fetch single product by MongoDB's _id
// @route   GET /api/products/db/:mongoId  (Using a different path to distinguish)
// @access  Public
const getProductByMongoId = async (req, res) => {
  try {
    console.log(`Fetching product with mongoId: ${req.params.mongoId} from MongoDB via controller...`);
    const productFromDB = await Product.findById(req.params.mongoId);
    if (!productFromDB) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(productFromDB);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Invalid MongoDB product ID format' });
    }
    res.status(500).send('Server Error: Could not fetch product');
  }
};


module.exports = {
  getProducts,
  getProductByIdFromJS,
  getProductByMongoId,
  // Add other product-related controller functions here (e.g., createProduct, updateProduct)
};