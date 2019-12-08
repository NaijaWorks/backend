const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
   name: String,
   logo: String,
   userId: String
});

module.exports = mongoose.model('Skill', skillSchema);