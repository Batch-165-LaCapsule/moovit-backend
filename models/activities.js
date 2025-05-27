//importation du module "mongoose"
const mongoose = require("mongoose")

//Schema du model de la Souscollection "subLevels" contenus dans la souscollection "levels"
const subLevelSchema = mongoose.Schema({
  subLevelID: Number,
  title: String,
  description: String,
  image: String,
  mediaUrl: String,
  tipOfThePro: String,
  timing: Number,
  xp: Number,
})

//Schema du model de la Souscollection "levels" contenus dans la collection "Activitys"
const levelSchema = mongoose.Schema({
  levelID: Number,
  title: String,
  description: String,
  image: String,
  subLevels: [subLevelSchema],
})

//Schema du model de la Collection "Activitys"
const activitySchema = mongoose.Schema({
  title: String,
  description: String,
  image: String,
  levels: [levelSchema],
})

//exportation du model "Activity"
const Activity = mongoose.model("activities", activitySchema)
module.exports = Activity
