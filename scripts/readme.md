# Procédure mise à jour galerie d’images

1. Lister les images sur Cloudinary : lancer `node list-images.js` pour générer/mettre à jour le fichier (ex : gallery.json) avec les URLs et tags Cloudinary.
2. Générer la galerie : exécuter `node generate-md-gallery.js` (ou `node generate-html-gallery.js` selon le script utilisé) pour créer/mettre à jour la galerie (ex : GALLERY.md ou HTML).
3. Ajouter et commit les changements :  `git add front/data/imagesData.json docs/images-gallery.md`  puis  `git commit -m "Update image gallery"`

4. Pousser sur le repo distant : `git push`.

Vérifie que le fichier `.env` est bien configuré avec tes clés Cloudinary avant de lancer les scripts. Adapte la procédure si tes noms de fichiers ou scripts diffèrent.
