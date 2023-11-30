const express = require('express');
const Product = require('../models/product');

const router = express.Router();
const shopController = require('../controllers/shopControl');

router.get('/',shopController.getIndex);

router.get('/cart',shopController.getCart);

router.post('/cart',shopController.postCart);

router.get('/products',shopController.getProducts);

router.get('/products/:ID',shopController.getEachProd);

// router.get('/checkout',shopController.getCheckout);

// router.get('/orders',shopController.getOrders);

// router.post('/create-order',shopController.postOrder);

// router.post('/cart-delete-product',shopController.postDeleteProduct);

    
module.exports=router;