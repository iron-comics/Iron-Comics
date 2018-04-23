const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname:String,
  birthday: Date,
  username: String,
  email: String,
  photo:{
    fieldname:String,
    originalname:String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
  },
  password: String,
  isAdmin:{type:Boolean, default:false},
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
