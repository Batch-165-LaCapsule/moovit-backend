// scripts/upload-front.js
// Upload toutes les images du dossier front/resources/images/ vers Cloudinary

import { v2 as cloudinary } from "cloudinary"
import { sync as globSync } from "glob"
import path from "path"
import dotenv from "dotenv"
import { fileURLToPath } from "url"

// Gestion des chemins en ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Charge les credentials depuis .env
dotenv.config({ path: path.join(__dirname, "../.env") })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Dossier source (absolu)
const BASE = path.resolve(__dirname, "../docs/assets/images/")

// Recherche tous les fichiers images (formats courants)
const files = globSync(`${BASE}/**/*.{avif,jpg,png,webp}`, { nocase: true })

if (files.length === 0) {
  console.error("❌ Aucun fichier trouvé dans ", BASE)
  process.exit(1)
}

// Boucle d’upload asynchrone
;(async () => {
  for (const file of files) {
    // Calcule le chemin Cloudinary (sans extension)
    const rel = path.relative(BASE, file).replace(/\\/g, "/")
    const publicId = `projectFinDeBatch/front/images/${rel}`.replace(
      /\.[^/.]+$/,
      ""
    )
    try {
      const res = await cloudinary.uploader.upload(file, {
        public_id: publicId,
        resource_type: "image",
      })
      console.log(`✅ ${rel} → ${res.secure_url}`)
    } catch (e) {
      console.error(`❌ Échec upload ${rel}:`, e.message)
    }
  }
})()
