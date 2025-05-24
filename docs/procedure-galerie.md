---
layout: default
title: Préocédure de mise à jour de la galerie Cloudinary
---

# Ajout et upload d’images locales vers Cloudinary

<div class="content-center" markdown="1">

Pour ajouter de nouvelles images dans la galerie, il faut d’abord :

1. **Déposer les images à uploader** dans le dossier :  
   `docs/assets/images/`
2. **Lancer le script d’upload** depuis le dossier `scripts/` :
   ```bash
   node upload-front.mjs
   ```
   - Ce script parcourt tous les fichiers images du dossier ci-dessus (formats supportés : avif, jpg, png, webp)
   - Chaque image est uploadée sur Cloudinary avec un identifiant basé sur son chemin relatif
   - À la fin de l’upload, les URLs Cloudinary seront utilisées par la procédure de génération de la galerie

**Remarque :**

- Vérifier que le fichier `.env` contient bien les identifiants Cloudinary (voir la section suivante)
- Si des images portent le même nom que d’autres déjà présentes sur Cloudinary, elles seront écrasées sur Cloudinary (vérifier les doublons)
- Il est recommandé de lancer ensuite la procédure d’actualisation de la galerie :
  ```bash
  node run_doc.mjs
  ```

---

# Procédure automatisée de mise à jour de la galerie d’images

> **Important :**  
> Toute la procédure est désormais automatisée.  
> **Il suffit de lancer la commande suivante depuis le dossier `/scripts` du projet :**
>
> ```bash
> node run_doc.mjs
> ```
>
> Cette commande va exécuter dans l’ordre :
>
> - La récupération des images Cloudinary et la génération du fichier `docs/imagesData.json`
> - La génération de la galerie Markdown `docs/images-gallery.md`
> - L’ajout automatique des fichiers générés à Git et un commit
>
> Plus besoin de lancer les scripts individuellement ni de faire le commit à la main.

---

## Détail de la procédure

1. **Vérifier que le fichier `.env` est bien configuré** avec les clés Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), placées à la racine du projet ou dans `/scripts`.

2. **Depuis le dossier `scripts/`**, exécuter la commande suivante :

   ```bash
   node run_doc.mjs
   ```

   - Ce script va successivement lancer :
     - `list-images.mjs` pour générer ou mettre à jour le fichier `docs/imagesData.json` avec les URLs, tags et variantes d’images Cloudinary.
     - `generate-md-gallery.mjs` pour créer ou mettre à jour la galerie Markdown dans `docs/images-gallery.md`.
     - L’ajout des fichiers générés à Git, suivi d’un commit automatique avec le message "Update image gallery".

3. **(Optionnel)** Pour pousser les modifications sur le dépôt distant, exécuter ensuite :
   ```bash
   git push
   ```

---

## Conseils et rappels

- Vérifier que les scripts `list-images.mjs`, `generate-md-gallery.mjs`, `upload-front.mjs` et `run_doc.mjs` sont bien présents dans le dossier `scripts/`.
- Adapter la procédure si les noms de fichiers ou la structure changent dans le projet.
- Consulter ce fichier `README.md` pour toute mise à jour ou information complémentaire sur l’utilisation des scripts de gestion de la galerie.

</div>
