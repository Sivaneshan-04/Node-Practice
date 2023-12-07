const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const shopRoutes = require("./routes/shop");
const adminData = require("./routes/admin");

const User = require("./models/user");

//app starts here
app.set("view engine", "ejs");

// app.engine('hbs',expressHbr.engine({layoutsDir: 'views/layouts',extname:'hbs',defaultLayout:'main-layout'}));
// app.set('view engine','hbs');
//app.set('view engine','hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//To create a new user using mongoDb
// app.use((req,res,next)=>{
//   User.findById('653a7e64e7c238b806384256').then(user=>{
//     req.user = new User(user.name,user.email,user.cart,user._id);
//     next();
//   }).catch(err=>console.log(err));
// });

//Creating a new user using Mongoose
app.use((req,res,next)=>{
  User.findById('656f1046c3ba3f5797db0a80').then(user=>{
    req.user = user
    next();
  }).catch(err=>console.log(err));
});

app.use(shopRoutes);
app.use("/admin", adminData.routes);

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
