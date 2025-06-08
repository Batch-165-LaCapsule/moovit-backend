//pour pas prendre en compte newreic quand je fait les tests
if (process.env.NODE_ENV !== "test") {
  require("newrelic")
}
require("dotenv").config()
require("./models/connection")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
const { swaggerUi, swaggerSpec } = require("./swagger")

var apiRouter = require("./routes/api") //api remplace l'appel a index

// var indexRouter = require("./routes/index"); //index n'est plus appelé
var usersRouter = require("./routes/users")
var app = express()
const cors = require("cors")
app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// sert le fichier public/index.html point d'entrée de la doc
app.use(express.static(path.join(__dirname, "public")))

// Sert la doc Jekyll sur /docs
app.use("/docs", express.static(path.join(__dirname, "docs", "_site")))

// app.use("/", indexRouter);
app.use("/api/users", usersRouter) // maj de usersRouter avec le /api
app.use("/api", apiRouter) //   indexRouter est remplacé par apiRouter (voir lg 12)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)) // route pour la doc d'api par Swagger

// Route principale — sert la page statique d’accueil (ex: index.html généré par Jekyll)
// Sert la page statique d'accueil index.html à la racine du domaine (https://api.mooveit.ovh)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

module.exports = app
