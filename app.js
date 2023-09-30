const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
// const expressHbr = require('express-handlebars');

const app = express();

const shopRoutes = require("./routes/shop");
const adminData = require("./routes/admin");

const sequelize = require("./utils/database");
const products = require("./models/new-product");
const User = require("./models/user");
const Cart = require('./models/cart');
const cartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

//app starts here
app.set("view engine", "ejs");
// app.engine('hbs',expressHbr.engine({layoutsDir: 'views/layouts',extname:'hbs',defaultLayout:'main-layout'}));
// app.set('view engine','hbs');
//app.set('view engine','hbs');

products.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(products);
User.hasOne(Cart);

products.belongsToMany(Cart,{through: cartItem});
Cart.belongsToMany(products,{through: cartItem});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(products,{through:OrderItem});

sequelize
  // .sync({force:true})
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "newUser", email: "test@test.com" });
    }

    return user; //this is auto converted into a resolved promise //if this is returned
  }).then((user)=>{
    return user.createCart();
  })
  .then((cart) => {
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

  app.use((req,res,next)=>{
    User.findByPk(1).then((user)=>{
      req.user=user;
      next();
    }).catch((err)=>{
      console.log(err);
    });
  })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(shopRoutes);
app.use("/admin", adminData.routes);

app.use((req, res, next) => {
  res
    .status(404)
    .render("404", { pageTitle: "Page Not Found", path: undefined });
});
