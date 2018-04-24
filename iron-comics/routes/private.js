const express = require('express');
const privateRoutes  = express.Router();
const List = require("../models/List");
const Comic = require("../models/Comic")

/* GET home page */
privateRoutes.get('/user', (req, res, next) => {
  res.render('private/user', {user:req.user});
});
privateRoutes.get("/list", (req, res) => {

  
  List.findOne({id_user:req.user.id})
  .populate("id_comic", "title img_icon")
  
  .then( list => {
    console.log(list.id_comic)
    res.render("private/comic_lists", {list:list.id_comic})});

  
})
module.exports = privateRoutes;
