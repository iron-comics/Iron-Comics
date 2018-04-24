const express = require('express');
const privateRoutes  = express.Router();

/* GET home page */
privateRoutes.get('/user', (req, res, next) => {
  res.render('private/user', {user:req.user});
});
module.exports = privateRoutes;
