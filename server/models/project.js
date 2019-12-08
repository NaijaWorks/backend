const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
   title: String,
   imageURL: String,
   description: String,
   projectURL: String,
   userId: String
});

module.exports = mongoose.model('Project', projectSchema);