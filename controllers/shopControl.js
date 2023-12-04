const Product = require("../models/product");
// const Order = require("../models/order");
exports.getIndex = (req, res, next) => {
  // Product.fetchAll()
  //   .then(([rows]) => {
  //     res.render("shop/shop", {
  //       prods: rows,
  //       pageTitle: "List",
  //       path: "/shop",
  //     });
  //   })
  //   .catch((err) => console.log(err));

  Product.fetchAll()
    .then((products) => {
      res.render("shop/shop", {
        prods: products,
        pageTitle: "List",
        path: "/shop",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEachProd = (req, res, next) => {
  const id = req.params.ID;
  console.log(id);
  Product.fetchById(id)
    .then((p) => {
      res.render("shop/product-detail", {
        p,
        pageTitle: p.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("shop/product-list", {
  //     prods: products,
  //     pageTitle: "Shop",
  //     path: "/products",
  //     // activeShop: true,
  //     // productCSS: true,
  //     // hasProducts: products.length > 0,
  //   });
  // });

  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/product-list", {
  //       prods: rows,
  //       pageTitle: "Shop",
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));

  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "My Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const proId = req.body.productId;

  Product.fetchById(proId)
    .then((prod) => {
      return req.user.addToCart(prod);
    })
    .then((result) => {
      console.log("Updated!!");
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });

  // let fetchedCart;
  // let newQuantity = 1;

  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart
  //       .getProducts({ where: { id: proId } })
  //       .then((prods) => {
  //         let product;

  //         if (prods.length > 0) {
  //           product = prods[0];
  //         }

  //         if (product) {
  //           newQuantity = product.cartItem.quantity + 1;
  //           return product;
  //         }

  //         return Product.findByPk(proId);
  //       })
  //       .then((product) => {
  //         return fetchedCart.addProduct(product, {
  //           through: { quantity: newQuantity },
  //         });
  //       })
  //       .then(() => res.redirect("/cart"))
  //       .catch((err) => console.log(err));
  //   })
  //   .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((order) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
        orders: order,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;

  req.user
    .deleteFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product = products[0];

  //     return product.cartItem.destroy();
  //   })
  //   .then((result) => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      console.log(result);
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};
