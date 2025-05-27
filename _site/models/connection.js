const mongoose = require("mongoose");

const connectionString = process.env.CONNECTION_STRING;

mongoose.set("strictQuery", true);

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Connexion réussie, les beaux gosses sont là !"))
  .catch((error) => console.error(error));

module.exports = connectionString;
