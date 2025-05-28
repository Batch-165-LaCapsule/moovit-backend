const mongoose = require("mongoose")

const connectionString = process.env.CONNECTION_STRING

const messages = [
  "Connexion réussie, les beaux gosses sont là !",
  "Connexion réussie : ne pas péter la prod",
  "C’est branché. Vous aussi vous n'y croyiez pas !",
  "Connexion à la base OK -> Yiipa !",
  "DB prête et nous ? on est prêts ?",
  "DB branchée. Au moins on pourra pas l'accuser de tout faire foirer",
  "La base répond : c'est une bonne base",
  "Connexion faite. Prochaine étape : dominer le monde (ou livrer ontime).",
  "Ça tourne. On ne touche plus rien jusqu'au demoDay",
  "DB OK, jusqu'à ce que quelqu'un merge dans le main",
  "DB connectée. On inspire, on code.",
  "C’est bon... jusqu'au prochain activity is not a function",
  "DB connectée > Un Repo Git pour les gouverner tous",
]

const msg = messages[Math.floor(Math.random() * messages.length)]

mongoose.set("strictQuery", true)

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log(msg))
  .catch((error) => console.error(error))

module.exports = connectionString
