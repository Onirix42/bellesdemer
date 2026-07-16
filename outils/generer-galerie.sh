#!/bin/bash
# ============================================================
# Belles de Mer — Régénère galerie-data.js à partir du contenu
# du dossier Galerie/. À exécuter depuis la racine du site :
#   ./outils/generer-galerie.sh
# ============================================================
set -e
cd "$(dirname "$0")/.."

CATEGORIES=("Boucles d'oreilles" "Pendentifs" "Bagues" "Bracelets")

{
  echo "/* ============================================================"
  echo "   Belles de Mer — Données de la galerie"
  echo "   Fichier généré automatiquement par outils/generer-galerie.sh"
  echo "   le $(date '+%Y-%m-%d à %H:%M')."
  echo "   ============================================================ */"
  echo ""
  echo "const GALERIE_CATEGORIES = ["
  echo "  { id: 'boucles', dossier: \"Boucles d'oreilles\", titre: 'Boucles d’oreilles' },"
  echo "  { id: 'pendentifs', dossier: 'Pendentifs', titre: 'Pendentifs' },"
  echo "  { id: 'bagues', dossier: 'Bagues', titre: 'Bagues' },"
  echo "  { id: 'bracelets', dossier: 'Bracelets', titre: 'Bracelets' },"
  echo "];"
  echo ""
  echo "const GALERIE_IMAGES = {"
  for cat in "${CATEGORIES[@]}"; do
    if [[ "$cat" == *"'"* ]]; then
      echo "  \"$cat\": ["
    else
      echo "  '$cat': ["
    fi
    if [ -d "Galerie/$cat" ]; then
      find "Galerie/$cat" -maxdepth 1 -type f \
        \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) \
        ! -name '._*' -exec basename {} \; | sort | while read -r f; do
        echo "    '${f//\'/\\\'}',"
      done
    fi
    echo "  ],"
  done
  echo "};"
} > galerie-data.js

echo "galerie-data.js régénéré avec succès :"
grep -c "'" galerie-data.js > /dev/null && echo "  $(find Galerie -type f ! -name '._*' ! -name '.DS_Store' | wc -l | tr -d ' ') fichiers trouvés dans Galerie/"
