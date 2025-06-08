#!/bin/bash

echo "📦 Build statique de la doc Jekyll via Docker..."

docker run --rm \
  -v "$(pwd)/docs:/srv/jekyll" \
  -v "$(pwd)/public/docs:/srv/jekyll/_site" \
  jekyll/jekyll:4.2.2 \
  jekyll build --destination /srv/jekyll/_site

echo "✅ Build terminé dans public/docs"
