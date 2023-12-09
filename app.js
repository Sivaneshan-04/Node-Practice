const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);

const shopRoutes = require("./routes/shop");
const adminData = require("./routes/admin");
const loginRoutes = require('./routes/login');

const store = new mongoStore({
  uri:"mongodb+srv://siva:Shadow@cluster0.mcuyzrw.mongodb.net/new?retryWrites=true&w=majority",
  collection:'session'
})

const User = require("./models/user");

//Express app starts here
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret: 'this is my secret',saveUninitialized: false, resave: false,store: store}));

//To create a new user using mongoDb
// app.use((req,res,next)=>{
//   User.findById('653a7e64e7c238b806384256').then(user=>{
//     req.user = new User(user.name,user.email,user.cart,user._id);
//     next();
//   }).catch(err=>console.log(err));
// });

//Creating a new user using Mongoose
app.use((req,res,next)=>{
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id).then(user=>{
    req.user = user;
    next();
  }).catch(err=>console.log(err));
});

app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.use(loginRoutes.routes);


app.use((req, res, next) => {
  res
    .status(404)
    .render("404", { pageTitle: "Page Not Found", path: undefined });
});

// //MongoCode goes here
// MongoConnect((client)=>{
//   app.listen(3000);
// })

//Mongoose goes here
mongoose
  .connect(
    "mongodb+srv://siva:Shadow@cluster0.mcuyzrw.mongodb.net/new?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "ram",
          email: "test@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => console.log(err));
