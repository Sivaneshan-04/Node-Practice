//const Product = require("../models/product");
const Product = require("../models/new-product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
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

  // const product = new Product(title, imageUrl, description, price, null);
  // product.save();

  Product.create({ title, price, imageUrl, description })
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

  // Product.findById(prodId, (product) => {
  //   if (!product) {
  //     return res.redirect("/");
  //   }
  //   res.render("admin/edit-product", {
  //     pageTitle: "Edit Product",
  //     path: "/admin/edit-product",
  //     product,
  //   });
  // });

  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product,
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

  // const product = new Product(title, imageUrl, description, price, prodId);
  // product
  //   .save()
  //   .then(res.redirect("/admin/products"))
  //   .catch((err) => {
  //     console.log(err);
  //   });

  Product.findByPk(prodId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;

      return product.save();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;

  // Product.deleteById(prodId);

  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("Destroyed!!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("admin/productList", {
  //     prods: products,
  //     pageTitle: "Admin Products",
  //     path: "/admin/products",
  //   });
  // });

  Product.findAll()
    .then((products) => {
      res.render("admin/productList", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};
