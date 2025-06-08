# Procédure pour générer et servir la documentation Jekyll localement

## 1. Se placer dans le dossier `/docs/` du backend

```bash
cd /chemin/vers/le/projet/moovit-backend/docs/
```

## 2. Supprimer le dossier `_site` (optionnel mais conseillé)

```bash
rm -rf _site
```

## 3. Corriger les fichiers `.md` si nécessaire

Vérifie que chaque fichier `.md` commence strictement par :

```markdown
---
layout: default
title: Titre de la page
---
```

Pas de ligne vide avant `---`.

## 4. Construire le site avec Docker

```bash
docker run --rm -v "$PWD":/srv/jekyll -it jekyll/jekyll:4 jekyll build
```

> Ce build génère le dossier `_site/`.

## 5. Lancer le serveur local

```bash
bash serve-jekyll.sh
```

> Le script reste actif. Pour quitter, faire `Ctrl+C`.

## 6. Accéder au site

Depuis un navigateur :

```
http://localhost:4000/
```

Liens utiles :

- Accueil : http://localhost:4000/
- Galerie : http://localhost:4000/images-gallery.html
- Procédure galerie : http://localhost:4000/procedure-galerie.html
- Statistiques back : http://localhost:4000/stats-code-back.html
- Statistiques front : http://localhost:4000/stats-code-front.html

## 7. Pour arrêter le serveur

```bash
Ctrl + C
```
