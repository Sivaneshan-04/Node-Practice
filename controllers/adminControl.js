const {validationResult} = require('express-validator');

const Product = require("../models/product");
const fileHelper= require('../utils/file');


exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isLogin : req.session.isLogin,
    // productCSS: true,
    // formsCSS: true,
    // activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file ;

  if(!image){
    return res.status(422).render('admin/add-product',{
      pageTitle: "Add Product",
      path: "/admin/add-product",
      isLogin : req.session.isLogin,
    });
  }
  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });

  product
    .save()
    .then((result) => {
      console.log("result created");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.id;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product,
        isLogin : req.session.isLogin
      });
    })
    .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });;
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;

  Product.findById(prodId).then((prod) => {
    if (prod.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    } else {
      return Product.findById(prodId).then((product) => {
        product.title = title;
        product.price = price;
        product.description = description;
        if (image) {
          fileHelper.deleteFile(product.imageUrl);
          product.imageUrl = image.path;
        }
        return product.save();
      })
        .then(res.redirect("/admin/products")).then((result) => {
          console.log("Updated!!");
        })      
    }
  }).catch((err) => {
    console.log("this came from here");
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

  
};

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.prodId;
//   Product.findById(prodId).then((prod) => {
//     if (!prod) {
//       return next(new Error('Product not found.'));
//     }
//     fileHelper.deleteFile(prod.imageUrl);
//     return Product.deleteOne({ _id: prodId, userId: req.user._id})
//   }).then((result) => {
//     console.log("Destroyed!!");
//     res.redirect("/admin/products");
//   }).catch((err) => {
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);
//   });
// };

exports.getProducts = (req, res, next) => {
  Product.find({userId : req.user._id})
    .then((products) => {
      res.render("admin/productList", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isLogin : req.session.isLogin
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req,res,next)=>{
  const prodId = req.params.id;

  Product.findById(prodId).then((prod) => {
        if (!prod) {
          return next(new Error('Product not found.'));
        }
        fileHelper.deleteFile(prod.imageUrl);
        return Product.deleteOne({ _id: prodId, userId: req.user._id})
      }).then((result) => {
        console.log("Destroyed!!");
        res.status(200).json({message:"Product successfully deleted!"});
      }).catch((err) => {
        res.status(500).json({message:"Deleting product failed."});
      });
};