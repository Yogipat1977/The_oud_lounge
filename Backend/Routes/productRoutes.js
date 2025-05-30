// Backend/Routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductByIdFromJS,
  getProductByMongoId
} = require('../controllers/productController'); // Adjust path if necessary

// Route for getting all products
router.get('/', getProducts);

// Route for getting a single product by its original JS ID
router.get('/:id', getProductByIdFromJS);

// Route for getting a single product by its MongoDB _id
router.get('/db/:mongoId', getProductByMongoId);


// You might add other routes here later, like:
// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);

module.exports = router;