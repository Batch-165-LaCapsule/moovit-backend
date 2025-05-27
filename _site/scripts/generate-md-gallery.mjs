// scripts/generate-md-gallery.js
// Génère un fichier Markdown interactif pour la galerie d’images à partir du JSON produit par list-images.js

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Gestion des chemins absolus en ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Chemin d’entrée : JSON généré par list-images.js (attention au chemin si tu as déplacé front/data)
const dataJsonPath = path.resolve(__dirname, "../docs/imagesData.json")
// Chemin de sortie : galerie Markdown pour docs à la racine du projet
const galleryMdPath = path.resolve(__dirname, "../docs/images-gallery.md")

// Lecture du JSON contenant les infos images
const images = JSON.parse(fs.readFileSync(dataJsonPath, "utf-8"))

// Trie par date d'upload décroissante (plus récentes d'abord)
images.sort((a, b) => {
  if (b.created_at && a.created_at) {
    return new Date(b.created_at) - new Date(a.created_at)
  }
  return 0
})

// Récupère la liste de tous les tags uniques pour la génération des filtres
const allTags = Array.from(
  new Set(images.flatMap((img) => img.tags || []))
).sort()

// Début du contenu Markdown + CSS pour la grille
let md = `
---
layout: default
title: Galerie d’images Cloudinary
---
<!--
Galerie générée dynamiquement avec toutes les propriétés Cloudinary affichées.
-->
<div id="gallery-filters" style="margin-bottom: 1em;">
  <b>Filtres par tag :</b>
  ${allTags
    .map(
      (tag) => `
    <label style="margin-right: 10px;">
      <input type="checkbox" class="gallery-tag-filter" value="${tag}"> ${tag}
    </label>
  `
    )
    .join("")}
</div>
<style>
  .gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 1200px; margin: 2rem auto; }
  @media (max-width: 1000px) { .gallery { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .gallery { grid-template-columns: 1fr; } }
  .gallery-card { background: #fafafa; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px #0001; padding: 12px; display: flex; flex-direction: column; align-items: center; }
  .gallery-card img { width: 100%; border-radius: 8px; object-fit: cover; transition: filter 0.2s; }
  .cloud-tags { margin: 8px 0; font-size: .85em; color: #888; }
  .cloud-info { font-size: .9em; color: #444; margin-bottom: 6px; }
  .gallery-actions { margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .gallery-actions button { border: none; background: #f0b429; color: #222; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: .95em; transition: background 0.2s; }
  .gallery-actions button:active { background: #c29526; }
  .gallery-variant { margin-top: 6px; font-size: 0.85em; color: #607d8b; }
</style>
<div class="gallery">
`

images.forEach((img) => {
  let variants = ""
  if (img.format && img.format !== "avif") {
    variants = `
      <div class="gallery-variant">
        Voir en :
        <a href="${img.url.replace(
          "f_auto",
          "f_avif"
        )}" target="_blank">AVIF</a> |
        <a href="${img.url.replace(
          "f_auto",
          "f_jpg"
        )}" target="_blank">JPG</a> |
        <a href="${img.url.replace("f_auto", "f_png")}" target="_blank">PNG</a>
      </div>
    `
  }
  md += `
  <div class="gallery-card" data-tags="${(img.tags || []).join(",")}">
    <img src="${img.url}" alt="${img.alt}" data-original="${img.url}">
    <div class="cloud-info">
      Format : <b>${img.format || "-"}</b> | Dimensions : <b>${
    img.width || "?"
  }×${img.height || "?"}</b> | Taille : <b>${humanFileSize(img.bytes || 0)}</b>
    </div>
    <div class="cloud-tags">Tags : ${
      img.tags && img.tags.length ? img.tags.join(", ") : "aucun"
    }</div>
    <div class="gallery-actions">
      <button onclick="window.open('${img.url}', '_blank')">Ouvrir</button>
      <button class="copy-btn" data-url="${img.url}">Copier URL</button>
      <button class="filter-btn" data-filter="grayscale">Niveaux de gris</button>
      <button class="filter-btn" data-filter="none">Couleurs normales</button>
    </div>
    ${variants}
  </div>
  `
})

// JS intégré pour le copier/coller d’URL, les filtres visuels, et le filtre multi-tags
md += `</div>
<script>
// Boutons Copier
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    navigator.clipboard.writeText(btn.dataset.url)
    btn.textContent = "Copié !"
    setTimeout(() => btn.textContent = "Copier URL", 1200)
  })
})
// Boutons Filtres couleurs
document.querySelectorAll('.gallery-card').forEach(card => {
  const img = card.querySelector('img')
  card.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if(btn.dataset.filter === "grayscale") img.style.filter = "grayscale(1)"
      else img.style.filter = ""
    })
  })
})
// Filtres par tags cumulatif
const filterCheckboxes = document.querySelectorAll('.gallery-tag-filter')
filterCheckboxes.forEach(cb => cb.addEventListener('change', filterGallery))

function filterGallery() {
  const checked = Array.from(filterCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
  document.querySelectorAll('.gallery-card').forEach(card => {
    const tags = (card.dataset.tags || "").split(",").filter(Boolean)
    // Affiche si tous les tags cochés sont dans l'image (cumulatif ET)
    if (!checked.length || checked.every(tag => tags.includes(tag))) {
      card.style.display = ""
    } else {
      card.style.display = "none"
    }
  })
}
</script>
`

// Vérifie/crée le dossier cible pour la galerie Markdown
const galleryDir = path.dirname(galleryMdPath)
if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true })

// Génère la galerie Markdown
fs.writeFileSync(galleryMdPath, md, "utf-8")
console.log("✅ images-gallery.md généré enrichi, trié et filtrable !")

// Fonction utilitaire (déjà présente mais il vaut mieux la redéfinir ici)
function humanFileSize(bytes) {
  if (bytes === 0) return "0 Ko"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const sizes = ["octets", "Ko", "Mo", "Go"]
  return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + " " + sizes[i]
}
