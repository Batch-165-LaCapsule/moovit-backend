//importation du module "mongoose"
const mongoose = require("mongoose")

//Schema du model de la Souscollection "Stats" contenus dans la collection "Users"
const statSchema = mongoose.Schema({
  nbSessions: { type: Number, default: 0 },
  totalTime: { type: Number, default: 0 },
  lastConnection: Date,
  nbEtaps: Number,
  creationDate: Date,
  lastModified: Date,
})

//Schema du model de la Souscollection "form" contenus dans la collection "Users"

const formSchema = mongoose.Schema({
  reason: String,
  dayTime: String,
})

//Schema du model de la Collection "Users"
const userSchema = mongoose.Schema({
  admin: { type: Boolean, default: false },
  token: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: String,
  name: String,
  gender: String,
  age: Number,
  //déclaration du type geojson point
  coordinate: {
    name: String,
    location: { type: { type: String }, coordinates: { type: [Number] } },
  },
  city: String,
  notificationActive: Boolean,
  //photoUrl:{type:String, default:"https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1748005964/projectFinDeBatch/front/images/default-profile_cltqmm.png"},
  photoUrl: String,
  currentLevelID: Number,
  currentSubLevelID: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  isSocialConnected: Boolean,
  sportPlayed: [{ type: mongoose.Schema.Types.ObjectId, ref: "activities" }],
  form: formSchema,
  stats: statSchema,
  medals: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "medals" }],
    default: [],
  },
  height: Number,
  weight: Number,
})

//exportation du model "User"
const User = mongoose.model("users", userSchema)
module.exports = User
