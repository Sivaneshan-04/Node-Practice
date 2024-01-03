const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("login", {
    path: "/login",
    pageTitle: "Login",
    isLogin: req.session.isLogin,
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationError: [],
  });
};

exports.postLogin = (req, res, next) => {
  const password = req.body.password;
  console.log(password);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("login", {
      path: "/login",
      pageTitle: "Login",
      isLogin: req.session.isLogin,
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email:req.body.email,
        password:req.body.password
      },
      validationError: errors.array(),
    });
  };

  return req.session.save((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("userExists");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("signup", {
    path: "/signup",
    pageTitle: "Signup",
    isLogin: req.session.isLogin,
    errorMessage: message,
    oldInput: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationError: [],
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("signup", {
      path: "/signup",
      pageTitle: "Signup",
      isLogin: req.session.isLogin,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationError : errors.array(),
    });
  }

  console.log("creating password", password);

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("userExists", "Email already exists, Please enter a new one");
        return res.redirect("/signup");
      }

      bcrypt
        .hash(password, 12)

        .then((hashedPassword) => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          console.log("user created");
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "sivaneshankg12@gmail.com",
            subject: "Successfully signedup",
            html: "<h1>Welcome to our shop</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("userExists");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("password", {
    path: "/reset-password",
    pageTitle: "Reset Password",
    isLogin: req.session.isLogin,
    errorMessage: message,
  });
};

exports.postResetPassword = (req, res, next) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password === confirmPassword) {
    res.redirect("/");
  } else {
    req.flash("userExists", "Both the passwords does not match");
  }
};
