const express = require('express');
const privateRoutes  = express.Router();
const List = require("../models/List");
const Comic = require("../models/Comic");
const User = require("../models/User");

/* GET home page */
privateRoutes.get('/user', (req, res, next) => {
  res.render('private/user');
});



/* CRUD -> Udpate, show user update form */
privateRoutes.get("/edit", (req, res) => {
User.findById(req.params.id).then(user => {
    res.render("private/edit");
  });
});

/* CRUD -> Udpate, update the user in DB */
privateRoutes.post("/edit", (req, res) => {
  const { firstname, lastname, birthday, email, username } = req.body;
  const updates = { firstname, lastname, birthday, email, username };
  User.findByIdAndUpdate(req.user.id, updates).then(() => {
    res.redirect("/private/user");
  });
});

/* CRUD -> Delete the user in DB */
privateRoutes.get("/delete", (req, res) => {
  User.findByIdAndRemove(req.user.id).then(() => {
    res.redirect("/");
  });
});



module.exports = privateRoutes;
