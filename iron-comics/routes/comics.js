require("dotenv").config();
const express = require("express");
const passport = require("passport");
const comics = express.Router();
const axios = require("axios");
const Comic = require("../models/Comic");
const User = require("../models/User");
const List = require("../models/List");

comics.get("/", (req, res, next) => {
  const idcomic = req.query.id;

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
          console.log("Existe" + c);
          List.findOneAndUpdate({ id_user: req.user.id },{$push:{id_comic:c.id}}, (err, l) => {
            if (l !== null) {
              console.log("Existe Lista");
              res.render("comics/add", { datacomic });
            } else {
              const listInfo = {
                id_user: req.user.id,
                id_comic: [c.id]
              };
              const list = new List(listInfo);
              list.save().then(() => res.render("comics/add", { datacomic }));
            }
          });
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
            List.findOneAndUpdate({ id_user: req.user.id },{$push:{id_comic:newcomic.id}} ,(err, l) => {
              if (l !== null) {
                console.log("Existe Lista");
                l.id_comic.push(newcomic.id);
                res.render("comics/add", { datacomic });
              } else {
                const listInfo = {
                  id_user: req.user.id,
                  id_comic: [newcomic.id]
                };
                const list = new List(listInfo);
                list.save().then(() => res.render("comics/add", { datacomic }));
              }
            });
          });
        }
      });
    });
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
