const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   firstName: String,
   lastName: String,
   photoURL: String,
   email: String,
   showEmail: Boolean,
   phone: String,
   showPhone: Boolean,
   password: String,
   location: String,
   role: String,
   shortBio: String,
   longBio: String,
   token: String
});

module.exports = mongoose.model('User', userSchema);