const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");

const isAuth = require("../middleware/authenticator");
const loginController = require("../controllers/loginController");
const User = require("../models/user");

router.get("/login", loginController.getLogin);

router.post("/login",[
  check("email").isEmail().normalizeEmail().withMessage("Please enter a valid email").custom((value, { req }) => {
    return User.findOne({ email: value }).then(user => {
      if (!user) {
        return Promise.reject("Email not found");
      }
      
    });
  }),
  body("password", "Please enter a password with only numbers and text and at least 5 characters").isAlphanumeric().isLength({ min: 5 }).trim().custom((value, { req }) => {
    return User.findOne({ email: req.body.email })
    .then(user => {
      return bcrypt.compare(value, user.password).then(match => {
        if (!match) {
          return Promise.reject("Incorrect password");
        }
      });
    });
  }),
], loginController.postLogin);

router.get("/signup", loginController.getSignup);

router.post(
  "/signup",[
    check('name').trim().not().isEmpty().withMessage('Name cannot be empty'),
  check("email")
    .isEmail().normalizeEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("This email is forbidden");
      }
      return true;
    }),
  body('password', 'Please enter a password with only numbers and text and at least 5 characters').isAlphanumeric().isLength({ min: 5 }).trim(),
  body('confirmPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password.trim()) {
      throw new Error('Passwords have to match!');
    }
    return true;
  })],
  loginController.postSignup
);

router.post("/logout", isAuth, loginController.postLogout);

router.get("/reset-password", loginController.getResetPassword);

router.post("/reset-password", loginController.postResetPassword);

exports.routes = router;
