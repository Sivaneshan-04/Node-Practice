const express = require('express');
const Product = require('../models/product');

const router = express.Router();

const isAuth = require('../middleware/authenticator');
const shopController = require('../controllers/shopControl');

router.get('/',shopController.getIndex);

router.get('/cart',isAuth,shopController.getCart);

router.post('/cart',isAuth,shopController.postCart);

router.get('/products',shopController.getProducts);

router.get('/products/:ID',shopController.getEachProd);

// router.get('/checkout',shopController.getCheckout);

router.get('/orders',isAuth,shopController.getOrders);

router.post('/create-order',isAuth,shopController.postOrder);

router.post('/cart-delete-product',isAuth,shopController.postDeleteProduct);

    
module.exports=router;