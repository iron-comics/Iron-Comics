const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const comicSchema = new Schema({
  title: String,
  author:String,
  year: Date,
  maincharacter: String,
  plot: String,
});

const Comic = mongoose.model('Comic', comicSchema);
module.exports = Comic;