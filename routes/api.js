const express = require("express")
const router = express.Router()

//route GET pour vérifier si l'API fonctionne (healthcheck)
router.get("/status", (req, res) => {
  // Envoie une réponse JSON contenant un message de confirmation, un statut, et la date actuelle
  res.json({
    status: "ok",
    message: "🚀 API Mooveit is online",
    timestamp: new Date().toISOString(),
  })
})

// futures routes API si besoin


module.exports = router
