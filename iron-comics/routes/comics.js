require("dotenv").config();
const express = require("express");
const passport = require('passport');
const comics = express.Router();
const axios = require("axios");


comics.get("/all", (req, res) => {
    

    
    // const Name = "Batman";
    // const issue_number = "issue_number:20";

    
    res.render("comics/allcomics");
})
comics.post("/comic", (req, res) => {
    const Name = req.body.name;
    const issue_number = `issue_number:${req.body.issue}`
    axios.get(`https://comicvine.gamespot.com/api/issues/?api_key=${process.env.API_KEY}&sort=issue_number:asc&filter=name:${Name},${issue_number}&format=json`)
  .then(comic => {
    res.render("comics/comics", {pepe:comic.data.results})
});

})

module.exports = comics;