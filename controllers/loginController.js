const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // console.log(req.session);
  res.render("login", {
    path: "/login",
    pageTitle: "Login",
    isLogin : req.session.isLoggedIn
  });
};


exports.postLogin =(req,res,next)=>{
  req.session.isLoggedIn = true;

  User.findById('65747c8edcbbbd12f7ae5f8c').then(user=>{
    req.session.user = user;
    req.session.save(err=>{
      console.log(err);
      res.redirect('/');
    });
    
  }).catch(err=>console.log( 'error in login',err));
}

exports.postLogout = (req,res,next)=>{
  req.session.destroy(err=>{
    console.log(err);
    res.redirect('/');
  })
};

