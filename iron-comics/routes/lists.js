require("dotenv").config();
const express = require("express");
const passport = require("passport");
const listsRoutes = express.Router();
const axios = require("axios");
const Comic = require("../models/Comic");
const User = require("../models/User");
const List = require("../models/List");

listsRoutes.get("/create", (req, res) => {
    res.render("lists/create", {user:req.user})
})

listsRoutes.post("/create", (req, res) => {
    const name = req.body.name;
    const id_user = req.user.id;

    const list = new List({name, id_user});
    list.save()
    .then(() => res.redirect("/private/lists") )
    
})



module.exports = listsRoutes;
