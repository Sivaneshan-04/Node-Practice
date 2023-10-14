const path = require('path');
const express = require('express');

const router = express.Router();


const adminController = require('../controllers/adminControl');

router.get('/add-product',adminController.getAddProduct);

router.post('/add-product',adminController.postAddProduct);

router.get('/edit-product/:id',adminController.getEditProduct);

router.post('/edit-product',adminController.postEditProduct);

router.post('/delete-product',adminController.postDeleteProduct);

router.get('/products',adminController.getProducts);    

exports.routes= router;
