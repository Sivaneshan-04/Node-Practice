const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/authenticator');
const adminController = require('../controllers/adminControl');
const addProductValidator = require('../middleware/shopValidator');

router.get('/add-product',isAuth,adminController.getAddProduct);

router.post('/add-product',addProductValidator,isAuth,adminController.postAddProduct);

router.get('/edit-product/:id',isAuth,adminController.getEditProduct);

router.post('/edit-product',addProductValidator,isAuth,adminController.postEditProduct);

router.post('/delete-product',isAuth,adminController.postDeleteProduct);

router.get('/products',isAuth,adminController.getProducts);    

exports.routes= router;
