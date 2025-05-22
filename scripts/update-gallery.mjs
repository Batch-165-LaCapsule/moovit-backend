// update-gallery.mjs
// À placer à la racine du projet (parent de /back et /front)

import { execSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Gestion du chemin absolu
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")

// Fonction utilitaire pour lancer une commande synchronously et afficher les logs
function run(cmd, cwd = process.cwd(), options = {}) {
  console.log(`\n---\n▶️  ${cmd} (in ${cwd})`)
  try {
    execSync(cmd, {
      stdio: "inherit",
      cwd,
      shell: process.env.SHELL || true, // <-- clé pour Bash/Git Bash
      ...options,
    })
  } catch (e) {
    // Spécial pour git commit "nothing to commit, working tree clean"
    if (cmd.startsWith("git commit") && e.status === 1) {
      console.log("ℹ️  Rien à committer (working tree clean).")
    } else {
      console.error(`❌ Erreur pour "${cmd}" :`, e.message)
      process.exit(1)
    }
  }
}

// 0. (Optionnel) Upload images locales vers Cloudinary
// Décommente la ligne suivante pour uploader toutes les images locales avant de générer le JSON :
// run("node scripts/upload-front.js", path.join(__dirname, "back"))

// 1. Génère le JSON d'images (list-images.js)
run("node list-images.mjs", __dirname)

// 2. Génère la galerie markdown (generate-md-gallery.js)
run("node generate-md-gallery.mjs", __dirname)

// 3. Ajoute les fichiers générés au suivi git et commit
const filesToAdd = ["docs/imagesData.json", "docs/images-gallery.md"]

for (const relPath of filesToAdd) {
  const absPath = path.join(projectRoot, relPath)
  if (!fs.existsSync(absPath)) {
    console.error(`❌ Fichier introuvable : ${relPath}`)
    process.exit(1)
  }
}

run(`git add ${filesToAdd.join(" ")}`, projectRoot)
run(`git commit -m "Update image gallery"`, projectRoot)

// Pour push automatiquement, décommente la ligne ci-dessous :
// run(`git push`, __dirname)

console.log("\n✅ Galerie mise à jour et commitée !")
