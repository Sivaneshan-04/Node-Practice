const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
// const expressHbr = require('express-handlebars');

const app = express();

const shopRoutes = require("./routes/shop");
const adminData = require("./routes/admin");

const MongoConnect = require('./utils/database').MongoConnect;
//app starts here
app.set("view engine", "ejs");
// app.engine('hbs',expressHbr.engine({layoutsDir: 'views/layouts',extname:'hbs',defaultLayout:'main-layout'}));
// app.set('view engine','hbs');
//app.set('view engine','hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(shopRoutes);
app.use("/admin", adminData.routes);

app.use((req, res, next) => {
  res
    .status(404)
    .render("404", { pageTitle: "Page Not Found", path: undefined });
});


//MongoCode goes here

MongoConnect((client)=>{
  app.listen(3000);
})
