---
layout: default
title: Routes
---

<div class="content-center" markdown="1">
# API Routes

Voici un aperçu des principales routes backend exposées par le service API.  
Elles permettent aux clients (web & mobile) de gérer les utilisateurs et d’accéder aux URLs Cloudinary.

> Ces routes sont documentées ici pour que chaque membre de l’équipe sache comment intégrer l’authentification et la récupération des images depuis Cloudinary.

---

## AUTHENTIFICATION

---

### POST `/api/signup`

**Objectif de la route :** créer un nouveau compte utilisateur.  
**Requête :**

- Méthode : `POST`
- URL : `/api/signup`
- En-tête : `Content-Type: application/json`
- Body :
  ```json
  {
    "email": "user@example.com",
    "password": "secret",
    "name": "Alice"
  }
  ```
  **Réponse :**

```json
{
  "userId": "abc123",
  "token": "eyJhbGci..."
}
```

### POST `/api/signin`

**Objectif de la route :** authentifier un utilisateur existant.  
**Requête :**

- Méthode : `POST`
- URL : `/api/signin`
- En-tête : `Content-Type: application/json`
- Body :
  ```json
  {
    "email": "user@example.com",
    "password": "secret"
  }
  ```
  **Réponse :**

```json
{
  "userId": "abc123",
  "token": "eyJhbGci..."
}
```

---

## MÉDIAS

---

### GET `/api/images/:category/:id`

**Objectif de la route :** renvoyer l’URL publique Cloudinary pour une image donnée.  
**Requête :**

- Méthode : `GET`
- URL : `/api/images/:category/:id`
- Params :
  - `category` : `avatars` | `backgrounds` | `badges`
  - `id` : identifiant ou nom de fichier (sans extension)  
    **Exemple :** `GET /api/images/avatars/12345`  
    **Réponse :**

```json
{
  "url": "https://res.cloudinary.com/deuhttaaq/image/upload/v…/avatars/12345.jpg"
}
```

### POST `/api/images/upload`

**Objectif de la route :** uploader une image côté serveur (utilise les crédentials Cloudinary).  
**Requête :**

- Méthode : `POST`
- URL : `/api/images/upload`
- En-têtes :
  - `Authorization: Bearer <token>`
- Body (FormData) :
  - `file` : fichier binaire
  - `category` : `avatars` | `backgrounds` | `badges`  
    **Exemple avec `curl` :**

```bash
curl -X POST https://your.api.server/api/images/upload   -H "Authorization: Bearer eyJhbGci…"   -F file=@avatar.png   -F category=avatars
```

**Réponse :**

```json
{
  "publicId": "avatars/12345",
  "secureUrl": "https://res.cloudinary.com/deuhttaaq/image/upload/v…/avatars/12345.png"
}
```

</div>
