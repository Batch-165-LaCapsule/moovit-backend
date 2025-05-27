const express = require("express")
const router = express.Router()

// Healthcheck
router.get("/status", (req, res) => {
  res.json({
    status: "ok",
    message: "🚀 API Mooveit is online",
    timestamp: new Date().toISOString(),
  })
})

// futures routes API si besoin

module.exports = router
