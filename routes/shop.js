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

router.get('/checkout',shopController.getCheckout);

router.get('/orders',isAuth,shopController.getOrders);

//Remember to protect this route after deploying the website
router.get('/checkout/success', shopController.getOrder);

router.get('/checkout/cancel', shopController.getCheckout);

router.post('/create-order',isAuth,shopController.postOrder);

router.post('/cart-delete-product',isAuth,shopController.postDeleteProduct);

router.get('/orders/:orderId',isAuth,shopController.getInvoice);

    
module.exports=router;