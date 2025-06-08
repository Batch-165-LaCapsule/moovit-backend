#!/bin/bash

echo "📦 Build statique de la doc Jekyll..."

# Conversion du chemin actuel pour Docker sous Windows
WINPWD=$(pwd -W 2>/dev/null || cygpath -w "$PWD")

# Exécution du build Jekyll avec Docker depuis /docs vers /public/docs
docker run --rm \
  -v "$WINPWD/docs":/srv/jekyll \
  -v "$WINPWD/public/docs":/srv/jekyll/_site \
  jekyll/jekyll:4 \
  bash -c "gem install webrick && jekyll build"
