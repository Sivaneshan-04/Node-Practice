const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/shop", {
        prods: products,
        pageTitle: "List",
        path: "/shop",
        isLogin : req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getEachProd = (req, res, next) => {
  const id = req.params.ID;
  +Product.findById(id)
    .then((p) => {
      res.render("shop/product-detail", {
        p,
        pageTitle: p.title,
        path: "/products",
        isLogin : req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        isLogin : req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "My Cart",
        products: user.cart.items,
        isLogin : req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const proId = req.body.productId;

  Product.findById(proId)
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
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//     isLogin : req.session.isLoggedIn
//   });
// };

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
};
exports.getOrders = (req, res, next) => {
  Order.find({"user.userId":req.user._id})
    .then((order) => {
      console.log(order);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
        orders: order,
        isLogin : req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const product = user.cart.items;

    const order = new Order({
      user: { name: req.user.name, userId: req.user },
      prods: product.map((i) => {
        return {
          quantity: i.quantity,
          productData: {...i.productId._doc},
        };
      }),
    });
    return order.save()
  }).then((result)=>{
    return req.user.clearCart();
  })
    .then((result) => {
      console.log(result);
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};
