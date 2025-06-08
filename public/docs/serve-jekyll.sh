#!/bin/bash

echo "📦 Lancement de Jekyll avec Docker..."

# Conversion du chemin Bash (ex: /c/...) vers chemin Windows (ex: C:/...)
WINPWD=$(pwd -W 2>/dev/null || cygpath -w "$PWD")
echo "📁 Répertoire courant (Windows) : $WINPWD"

docker run --rm -it -p 4000:4000 -v "$WINPWD":/srv/jekyll jekyll/jekyll:4 bash -c "gem install webrick && jekyll serve --watch --force_polling"
