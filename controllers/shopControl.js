const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render("shop/shop", {
        prods: rows,
        pageTitle: "List",
        path: "/shop",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEachProd = (req, res, next) => {
  const id = req.params.ID;
  // Product.findById(id, (p) => {
  //   res.render("shop/product-detail", {
  //     p,
  //     pageTitle: p.title,
  //     path: "/products/new",
  //   });
  // });

  Product.findById(id).then(([product])=>{
    res.render("shop/product-detail", {
          p:product,
          pageTitle: product.title,
          path: "/products/new",
        }
      )}).catch(err=>console.log(err));
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

  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    // Product.fetchAll((products)=>{
    //   const cartProducts= [];
    //   for(product of products){
    //     const cartProductData = cart.product.find(prod=>prod.id === product.id);
    //     if(cartProductData){
    //       cartProducts.push({productData : product, qty: cartProductData.qty})
    //     }
    //   }
    //   res.render('shop/cart',{
    //     path:'/cart',
    //     pageTitle: 'My Cart',
    //     products: cartProducts,
    //   })
    // })
    
  });
};

exports.postCart = (req, res, next) => {
  const proId = req.body.productId;
  Product.findById(proId, (product) => {
    Cart.addProduct(proId, product.price);
  });
  res.redirect("/");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Orders",
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const price = req.body.price;

  Cart.deleteProduct(prodId, price);

  res.redirect("/cart");
};
