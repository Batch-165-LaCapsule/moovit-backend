// scripts/run_doc.mjs
import { execSync } from "child_process"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Racine projet (un cran au-dessus de scripts/)
const projectRoot = path.resolve(__dirname, "..")

// Utilitaire d'exécution de commande
function run(cmd, cwd = process.cwd()) {
  console.log(`\n---\n▶️  ${cmd} (in ${cwd})`)
  try {
    execSync(cmd, { stdio: "inherit", cwd })
  } catch (e) {
    console.error(`❌ Erreur pour "${cmd}" :`, e.message)
    process.exit(1)
  }
}

// 1. Génère le JSON d'images
run("node list-images.mjs", __dirname)

// 2. Génère la galerie Markdown
run("node generate-md-gallery.mjs", __dirname)

// 3. Vérifie la présence des fichiers générés
const filesToAdd = ["docs/imagesData.json", "docs/images-gallery.md"]

for (const relPath of filesToAdd) {
  const absPath = path.join(projectRoot, relPath)
  if (!fs.existsSync(absPath)) {
    console.error(`❌ Fichier introuvable : ${relPath}`)
    process.exit(1)
  }
}

// 4. (Optionnel) Ajoute et commit les fichiers générés
run(`git add ${filesToAdd.join(" ")}`, projectRoot)
run(`git commit -m "Update image gallery"`, projectRoot)

// 5. (Optionnel) Push auto : décommente si tu veux
// run("git push", projectRoot)

console.log("\n✅ Génération de la doc images terminée et commitée !")
