require("dotenv").config();
const express = require("express");
const passport = require("passport");
const comics = express.Router();
const axios = require("axios");
const Comic = require("../models/Comic");
const User = require("../models/User");
const List = require("../models/List");

comics.get("/add", (req, res, next) => {
  const idcomic = req.query.id;
  if(!idcomic){
    res.redirect("/private/user")
    return;
  }
  axios
    .get(
      `https://comicvine.gamespot.com/api/issues/?api_key=${
        process.env.API_KEY
      }&sort=issue_number:asc&filter=id:${idcomic}&format=json`
    )
    .then(comic => {
      const datacomic = comic.data.results[0];
      Comic.findOne({ id_comic: datacomic.id }, (err, c) => {
        if (c !== null) {
          console.log("Existe comic" + c);
          search_list(req.user.id, c.id, datacomic);
        } else {
          if (!datacomic.store_date) datacomic.store_date = "unknown";
          const newcomic = new Comic({
            title: datacomic.name,
            year: datacomic.store_date,
            volume: datacomic.volume.name,
            img_icon: datacomic.image.icon_url,
            img_medium: datacomic.image.medium_url,
            issue_number: datacomic.issue_number,
            id_comic: datacomic.id,
            id_volume: datacomic.volume.id
          });
          newcomic.save().then(() => {
            search_list(req.user.id, newcomic.id, datacomic);
          });
        }
      });
    });
  const search_list = (id_user, id_comic, datacomic, name) => {
    console.log(id_comic);
    List.findOne({$and:[ {id_user}, {name}]}, (err, l) => {
      if (l !== null) {
        console.log("Existe Lista");
        for (let i = 0; i < l.id_comic.length; i++) {
          if (l.id_comic[i] == id_comic) {
            res.render("comics/add", { datacomic });
            return;
          }
        }
        l
          .update({ $push: { id_comic } })
          .then(() => res.render("comics/add", { datacomic }));
      } else {
        console.log("No existe lista");
      }
    });
  };
});

comics.get("/all", (req, res) => {
  res.render("comics/allcomics");
});
comics.post("/comic", (req, res) => {
  const Name = req.body.name;
  const issue_number = `issue_number:${req.body.issue}`;
  axios
    .get(
      `https://comicvine.gamespot.com/api/issues/?api_key=${
        process.env.API_KEY
      }&sort=issue_number:asc&filter=name:${Name},${issue_number}&format=json`
    )
    .then(comic => {
      res.render("comics/comics", { pepe: comic.data.results });
    });
  comics.post("/add", (req, res) => {
    const idcomic = req.query.id;

    axios
      .get(
        `https://comicvine.gamespot.com/api/issues/?api_key=${
          process.env.API_KEY
        }&sort=issue_number:asc&filter=id:${id}&format=json`
      )
      .then(comic => {
        res.render("comics/add", { pepe: comic.data.results });
      });
  });
});

module.exports = comics;
