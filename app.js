//global packages
const path = require("path");

//Custom packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();

//File imports
const shopRoutes = require("./routes/shop");
const adminData = require("./routes/admin");
const loginRoutes = require('./routes/login');
const User = require("./models/user");

//settings
const mongoStore = require('connect-mongodb-session')(session);
const store = new mongoStore({
  uri:process.env.MONGO_URI,
  collection:'session'
})
const csrfProtection= csrf();


//Express app starts here 
const app = express();

app.set("view engine", "ejs"); //assigning the default engine

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret: 'this is my secret',saveUninitialized: false, resave: false,store: store}));
app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{  //Creating a new user using Mongoose
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id).then(user=>{
    req.user = user;
    next();
  }).catch(err=>console.log(err));
});

app.use((req,res,next)=>{
  res.locals.isLogin = req.session.isLogin;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.use(loginRoutes.routes);

app.use((req, res, next) => { //Rendering the 404 page
  res
  .status(404)
  .render("404", { pageTitle: "Page Not Found", path: undefined });
});

//Starting the app
mongoose    //Mongoose goes here
.connect(
  process.env.MONGO_URI,{ useNewUrlParser: true,useUnifiedTopology: true }
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
  


  //For references


  // //MongoCode goes here
  // MongoConnect((client)=>{
    //   app.listen(3000);
    // })
  
  
  //To create a new user using mongoDb
  // app.use((req,res,next)=>{
  //   User.findById('653a7e64e7c238b806384256').then(user=>{
  //     req.user = new User(user.name,user.email,user.cart,user._id);
  //     next();
  //   }).catch(err=>console.log(err));
  // });

