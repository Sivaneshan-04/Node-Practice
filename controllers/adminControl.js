const Product = require("../models/product");
const {validationResult} = require('express-validator');

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
  const imageUrl = req.body.imageUrl;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      product,
      isLogin : req.session.isLogin
    });
  }
  console.log('id',req.user._id)

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user._id
  });

  product
    .save()
    .then((result) => {
      console.log("result created");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
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
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;

  const product = {
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  };

  Product.findById(prodId).then((prod) => {
    if (prod.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    } else {
      return Product.findByIdAndUpdate(prodId, product)
        .then(res.redirect("/admin/products"))
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    }
  });

  
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;

  Product.deleteOne({ _id: prodId, userId: req.user._id})
    .then((result) => {
      console.log("Destroyed!!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

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
    .catch((err) => console.log(err));
};
