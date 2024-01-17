const fs = require('fs');
const path = require('path');
const PDFdoument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const Product = require("../models/product");
const Order = require("../models/order");

//number per page
const PRODUCT_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find().countDocuments().then(num=>{
    totalItems = num;
    return Product.find()
    .skip((page-1)*PRODUCT_PER_PAGE)
    .limit(PRODUCT_PER_PAGE)
  }).then((products) => {
      res.render("shop/shop", {
        prods: products,
        pageTitle: "Shop",
        path: "/shop",
        isLogin : req.session.isLogin,
        lastPage: Math.ceil(totalItems / PRODUCT_PER_PAGE),
        currentPage: page,
      });
    })
    .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};


//   Product.find()
//   .skip((page-1)*2)
//   .limit(PRODUCT_PER_PAGE)
//     .then((products) => {
//       res.render("shop/shop", {
//         prods: products,
//         pageTitle: "List",
//         path: "/shop",
//         isLogin : req.session.isLogin
//       });
//     })
//     .catch((err) => {
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);
//   });;
// };

exports.getEachProd = (req, res, next) => {
  const id = req.params.ID;
  +Product.findById(id)
    .then((p) => {
      res.render("shop/product-detail", {
        p,
        pageTitle: p.title,
        path: "/products",
        isLogin : req.session.isLogin
      });
    })
    .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });;
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  // Product.find()
  //   .then((products) => {
  //     res.render("shop/product-list", {
  //       prods: products,
  //       pageTitle: "Shop",
  //       path: "/products",
  //       isLogin : req.session.isLogin
  //     });
  //   })
  Product.find().countDocuments().then(num=>{
    totalItems = num;
    return Product.find()
    .skip((page-1)*PRODUCT_PER_PAGE)
    .limit(PRODUCT_PER_PAGE)
  }).then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        isLogin : req.session.isLogin,
        lastPage: Math.ceil(totalItems / PRODUCT_PER_PAGE),
        currentPage: page,
      });
    })
    .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });;
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "My Cart",
        products: user.cart.items,
        isLogin : req.session.isLogin
      });
    })
    .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//     isLogin : req.session.isLogin
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
        isLogin : req.session.isLogin
      });
    })
    .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });;
};

exports.postOrder = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const product = user.cart.items;

    const order = new Order({
      user: { name: req.user.name, userId: req.user, email: req.user.email },
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = "invoice-" + orderId + ".pdf";
  const invoicePath = path.join('data','invoice',invoiceName);

  Order.findById(orderId).then((order)=>{
    if(!order){
      return (next(new Error('No order found')));
    }

    if(order.user.userId.toString() !== req.user._id.toString()){
      return next(new Error('You are unathorized!!'));
    }
    // fs.readFile(invoicePath,(err,data)=>{
    //   if(err){
    //     next(err);
    //   }
    //   res.setHeader('Content-Type','application/pdf');
    //   res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
    //   res.send(data);
    // })


    //this is the recommended way
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader('Content-Type','application/pdf');
    // res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
    // file.pipe(res);//to forward the stream to the response

    const pdf = new PDFdoument();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
    pdf.pipe(fs.createWriteStream(invoicePath));
    pdf.pipe(res);
    pdf.fontSize(26).text('Invoice');
    pdf.text('---------------------------------------------');
    pdf.text('');
    let totalPrice = 0;
    order.prods.forEach(prod=>{
      totalPrice += prod.quantity * prod.productData.price;
      pdf.fontSize(14).text(prod.productData.title + ' -> ' + prod.quantity + ' x ' + '$' + prod.productData.price);
    });
    pdf.text('---------------------------------------------');
    pdf.text('');
    pdf.fontSize(18).text('Total Price: $'+ totalPrice);
    pdf.end();
  }).catch(err=>next(err));  
};


exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      products = user.cart.items;
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: 'usd',
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

