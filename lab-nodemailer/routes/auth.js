const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const mailer = require("../helpers/mailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      message: "Indicate username, email and password"
    });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);

    const hashPass = bcrypt.hashSync(password, salt);

    const hashUser = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode: hashUser
    });

    mailer.send(username, email, hashUser)

    newUser.save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:id", (req, res, next) => {
  //console.log(req.params);
  res.render('auth/confirmation');
});

module.exports = router;
